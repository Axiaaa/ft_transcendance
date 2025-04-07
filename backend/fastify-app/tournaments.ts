import { ITournament, TournamentType  } from "./tournaments.d";
import { User } from "./user";
import { db, server } from ".";
import { getUserFromDb } from "./user";

export class Tournament implements ITournament {
    
    public id: number;
    public name: string;
    public password: string | null;
    public members: Array<Number>;
    public matches : Array<Number>;
    public winner: User | null;
    public creator: User;
    public created_at: Date;
    public duration?: number;
    public type: TournamentType;
    
    constructor(
        name : string,
        type : TournamentType,
        creator : User,
        password? : string,
        duration? : number
    )
    {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.name = name;
        this.password = password ? password : null;
        this.members = new Array<Number>();
        this.matches = new Array<Number>();
        this.creator = creator;
        this.winner = null;
        this.created_at = new Date();
        this.duration = duration ? duration : 0;
        this.type = type;

        this.members.push(creator.id);
    }

    async addMember(user: User) : Promise<string | null> {
        
        if (this.members.find(member => member === user.id)) {
            server.log.error(`User ${user.username} is already in the tournament ${this.name}`);
            return "User is already in the tournament";
        }
        this.members.push(user.id);
        const req_message = this.updateTournamentInDb();
        return req_message
    }

    async removeMember(user: User) : Promise<string | null> {
        
        const index = this.members.findIndex(member => member === user.id);
        if (index === -1) {
            server.log.error(`User ${user.username} is not in the tournament ${this.name}`);
            return "User is not in the tournament";
        }
        this.members.splice(index, 1);
        const req_message = this.updateTournamentInDb();
        return req_message
    }   

    async pushTournamentToDb() : Promise<string | null> {

        if (this.id !== 0) {
            server.log.error(`Tournament ${this.name} already exists in the DB`);
            return "Tournament already exists";
        }

        try 
        {
            const insertTournament = db.prepare(`INSERT INTO tournaments (name, password, creator_id, created_at, duration, type) VALUES (?, ?, ?, ?, ?, ?)`);
            const insertMember = db.prepare(`INSERT INTO tournament_members (tournament_id, user_id) VALUES (?, ?)`);
            db.transaction(() => {
                const result = insertTournament.run(
                    this.name,
                    this.password,
                    this.creator.id,
                    Number(this.created_at),
                    this.duration,
                    this.type.valueOf()
                );
                this.id = result.lastInsertRowid as number;
                this.members.forEach(member => {
                    insertMember.run(this.id, member);
                });
            })();
            server.log.info(`Tournament ${this.name} created successfully`);
            return null;
        }
        catch (error) {
            server.log.error(`Error while creating tournament ${this.name} : ${error}`);
            return "Error while creating tournament";
        }
    }

    async updateTournamentInDb() : Promise<string | null> {
        
        if (this.id === 0) {
            server.log.error(`Tournament ${this.name} does not exist in the DB`);
            return "Tournament doesn't exist";
        }

        try 
        {
            const updateTournament = db.prepare(`UPDATE tournaments SET name = ?, password = ?, creator_id = ?, created_at = ?, duration = ?, type = ?, winner = ? WHERE id = ?`);
            const deleteMembers = db.prepare(`DELETE FROM tournament_members WHERE tournament_id = ?`);
            const insertMember = db.prepare(`INSERT INTO tournament_members (tournament_id, user_id) VALUES (?, ?)`);

            db.transaction(() => {
                updateTournament.run(
                    this.name,
                    this.password,
                    this.creator.id,
                    Number(this.created_at),
                    this.duration,
                    this.type.valueOf(),
                    this.winner ? this.winner.id : null,
                    this.id
                );
                deleteMembers.run(this.id);
                this.members.forEach(member => {
                    insertMember.run(this.id, member);
                });
            })();
            server.log.info(`Tournament ${this.name} updated successfully`);
            return null;
        }
        catch (error) {
            server.log.error(`Error while updating tournament ${this.name} : ${error}`);
            return "Error while updating tournament";
        }
    }

    async deleteTournamentFromDb() : Promise<string | null> {
        
        if (this.id === 0) {
            server.log.error(`Tournament ${this.name} does not exist in the DB`);
            return "Tournament does not exist";
        }

        try 
        {
            const deleteTournament = db.prepare(`DELETE FROM tournaments WHERE id = ?`);
            const deleteMembers = db.prepare(`DELETE FROM tournament_members WHERE tournament_id = ?`);
            db.transaction(() => {
                deleteTournament.run(this.id);
                deleteMembers.run(this.id);
            })();
            server.log.info(`Tournament ${this.name} deleted successfully`);
            return null;
        }
        catch (error) {
            server.log.error(`Error while deleting tournament ${this.name} : ${error}`);
            return "Error while deleting tournament";
        }
    }
}

export async function getTournamentFromDb(id: number) : Promise<Tournament | null> {

    try {
        const sqlRequest = "SELECT * FROM tournaments WHERE id = ?";
        const getMatches = db.prepare("SELECT id FROM matchs WHERE tournament_id = ?");

        const tournamentRow = db.prepare(sqlRequest).get(id) as { 
            id: number;
            name: string;
            password: string;
            creator_id: number;
            created_at: string;
            duration: number;
            type: number;
            winner : number | null;
        } | undefined;

        if (!tournamentRow) return null;

        const matches = getMatches.all(id) as Array<{ id: number }>;
        const creator = await getUserFromDb(tournamentRow.creator_id);
        if (creator == null) return null;

        let tournament = new Tournament(
            tournamentRow.name,
            tournamentRow.type as TournamentType,
            creator,
            tournamentRow.password,
            tournamentRow.duration
        );
        tournament.id = tournamentRow.id;
        tournament.created_at = new Date(tournamentRow.created_at);
        tournament.members = (await getTournamentMembers(tournamentRow.id))?.map((user: User) => user.id) || [];
        if (tournament.members.find(member => member === creator.id) === undefined)
            tournament.members.push(creator.id);
        tournament.matches = matches.map(match => match.id);
        tournament.winner = tournamentRow.winner ? await getUserFromDb(tournamentRow.winner) : null;
    
        return tournament;
    }
    catch (error) {
        server.log.error(`Error while getting tournament ${id} from the DB: ${error}`);
        return null;
    }
}

export async function getTournamentMembers(id: number) : Promise<Array<User> | null> {

    try {
        const members = db.prepare("SELECT user_id FROM tournament_members WHERE tournament_id = ?").all(id) as Array<{ user_id: number }>;
        const users = await Promise.all(members.map(async (member: { user_id: number }) => {
            const user = await getUserFromDb(member.user_id);
            return user;
        }));
        return users.filter(user => user != null) as Array<User>;
    }
    catch (error) {
        server.log.error(`Error while getting members of tournament ${id} from the DB: ${error}`);
        return null;
    }
}


