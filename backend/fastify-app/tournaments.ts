import { ITournament, TournamentType  } from "./tournaments.d";
import { User } from "./user";
import { db, server } from ".";
import { getUserFromDb } from "./user";

export class Tournament implements ITournament {
    
    public id: number;
    public name: string;
    public password: string;
    public members: Array<User>;
    public winner: User | null;
    public creator: User;
    public created_at: Date;
    public duration: number;
    public type: TournamentType;
    
    constructor(
        name : string,
        password : string,
        type : TournamentType,
        creator : User,
        duration? : number
    )
    {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.name = name;
        this.password = password;
        this.members = new Array<User>();
        this.creator = creator;
        this.winner = null;
        this.created_at = new Date();
        this.duration = 0;
        this.type = type;

        this.members.push(creator);
    }

    async addMember(user: User) : Promise<string | null> {
        
        if (this.members.find(member => member.id === user.id)) {
            server.log.error(`User ${user.username} is already in the tournament ${this.name}`);
            return "User is already in the tournament";
        }
        this.members.push(user);
        return null;
    }

    async removeMember(user: User) : Promise<string | null> {
        
        const index = this.members.findIndex(member => member.id === user.id);
        if (index === -1) {
            server.log.error(`User ${user.username} is not in the tournament ${this.name}`);
            return "User is not in the tournament";
        }
        this.members.splice(index, 1);
        return null;
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
                    insertMember.run(this.id, member.id);
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

    async updateTournamentInDb() {
        
        if (this.id === 0) {
            server.log.error(`Tournament ${this.name} does not exist in the DB`);
            return "Tournament does not exist";
        }

        try 
        {
            const updateTournament = db.prepare(`UPDATE tournaments SET name = ?, password = ?, creator_id = ?, created_at = ?, duration = ?, type = ? WHERE id = ?`);
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
                    this.id
                );
                deleteMembers.run(this.id);
                this.members.forEach(member => {
                    insertMember.run(this.id, member.id);
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

    async deleteTournamentFromDb() {
        
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
        const sqlrequest = "SELECT * FROM tournaments WHERE id = ?";
        const tournamentRow = db.prepare(sqlrequest).get(id) as { 
            id: number;
            name: string;
            password: string;
            creator_id: number;
            created_at: string;
            duration: number;
            type: number;
        } | undefined;

        if (!tournamentRow) return null;

        const creator = await getUserFromDb(tournamentRow.creator_id);
        if (creator == null) return null;

        let tournament = new Tournament(
            tournamentRow.name,
            tournamentRow.password,
            tournamentRow.type as TournamentType,
            creator,
            tournamentRow.duration
        );
        tournament.id = tournamentRow.id;
        tournament.created_at = new Date(tournamentRow.created_at);
        tournament.members = await getTournamentMembers(id) as Array<User>;

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
        const users = new Array<User>();
        members.forEach((member: { user_id: number }) => {
            getUserFromDb(member.user_id).then(user => {
                if (user != null) {
                    users.push(user);
                }
            });
        });
        return users;
    }
    catch (error) {
        server.log.error(`Error while getting members of tournament ${id} from the DB: ${error}`);
        return null;
    }
}


