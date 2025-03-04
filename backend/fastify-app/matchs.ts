import { IMatch } from "./matchs.d";
import { server } from ".";
import { db } from ".";
import { getUserFromDb } from "./user";

export class Match implements IMatch {

    public id: number;
    public player1: string;
    public player2: string;
    public winner: string | null;
    public score: string;
    public created_at: Date;
    public is_tournament: boolean;
    public tournament_id: number | null;

    constructor(
        player1: string,
        player2: string,
        isTournament : boolean,
        tournament_id? : number
    ) {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.player1 = player1;
        this.player2 = player2;
        this.winner = null;
        this.score = "0 - 0";
        this.created_at = new Date();
        this.is_tournament = isTournament;
        this.tournament_id = tournament_id ? tournament_id : null;
    }


    async pushMatchToDb() : Promise<string | null> {

        if (this.id !== 0) {
            server.log.error(`Match ${this.id} already exists in the DB`);
            return "Match already exists";
        }

        server.log.info(`${this.player1}`)
        try {
            const insertMatch = db.prepare(`
                INSERT INTO matchs (player1, player2, winner, score, created_at, is_tournament, tournament_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

            db.transaction(() => {
                const result = insertMatch.run(
                    this.player1,
                    this.player2,
                    this.winner,
                    this.score,
                    Number(this.created_at),
                    this.is_tournament ? 1 : 0,
                    this.tournament_id
                );
                
                this.id = result.lastInsertRowid as number;
                })();
                
            server.log.info(`Match ${this.id} added to the DB`);
            return null;
        }
        catch (error) {
            server.log.error(`Error while adding match ${this.id} to the DB: ${error}`);
            return "Error while adding match to the DB";
        }
    }

    async deleteMatchInDb() : Promise<string | null> {

        if (this.id === 0) {
            server.log.error(`Match ${this.id} doesn't exist in the DB`);
            return "Match doesn't exist";
        }

        try {
            const deleteMatch = db.prepare(`DELETE FROM matchs WHERE id = ?`);
            db.transaction(() => {
                deleteMatch.run(this.id);
            }
            )();
            server.log.info(`Match ${this.id} deleted from the DB`);
            return null;
        }
        catch (error) {
            server.log.error(`Error while deleting match ${this.id} from the DB: ${error}`);
            return "Error while deleting match from the DB";
        }
    }

    async updateMatchInDb() : Promise<string | null> {
        
        if (this.id === 0) {
            server.log.error(`Match ${this.id} doesn't exist in the DB`);
            return "Match doesn't exist";
        }

        try {
            //If both players are deleted, delete the match
            if (this.player1 == null && this.player2 == null && this.is_tournament == false) {
                this.deleteMatchInDb();
                return "Match deleted because both players no longer exist";
            }

            const updateMatch = db.prepare(`
                UPDATE matchs
                SET player1 = ?, player2 = ?, winner = ?, created_at = ?, score = ?, is_tournament = ?
                WHERE id = ?
                `);

            db.transaction(() => {
                updateMatch.run(this.player1, this.player2, this.winner, Number(this.created_at), this.score, this.is_tournament ? 1 : 0, this.id);
            })();

            server.log.info(`Match ${this.id} updated in the DB`);
            return null;
        }
        catch (error) {
            server.log.error(`Error while updating match ${this.id} in the DB: ${error}`);
            return "Error while updating match in the DB";
        }
    }
}


export async function getMatchFromDb(id : number) : Promise<Match | null> {
    
    try {
        const sqlRequest = `SELECT * FROM matchs WHERE id = ?`;
        const matchRow = db.prepare(sqlRequest).get(id) as { 
            id: number;
            player1: string;
            player2: string;
            winner: string;
            score: string;
            created_at: Date;
            is_tournament: boolean;
            tournament_id: number | null;
        } | undefined;

        if (!matchRow) return null;

        let match = new Match(matchRow.player1, matchRow.player2, matchRow.is_tournament ? true : false);
        match.id = matchRow.id;
        match.score = matchRow.score;
        match.created_at = new Date(matchRow.created_at);
        match.tournament_id = matchRow.tournament_id;

        if (matchRow.winner != null) {
            if (await getUserFromDb(Number(matchRow.winner)) == null) {
                match.winner = "Deleted user";
            }
            else {
                match.winner = matchRow.winner;
            }
        }

        if (await getUserFromDb(Number(matchRow.player1)) == null) {
            match.player1 = "Deleted user";
        }
        if (await getUserFromDb(Number(matchRow.player2)) == null) {
            match.player2 = "Deleted user";
        }
        
        if (match.player1 === "Deleted user" && match.player2 === "Deleted user") {
            await match.deleteMatchInDb();
            return null;
        }

        return match;
    } catch (error) {
        server.log.error(`Error while getting match ${id} from the DB: ${error}`);
        return null;
    }
}