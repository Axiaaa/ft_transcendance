"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
exports.getMatchFromDb = getMatchFromDb;
const _1 = require(".");
const _2 = require(".");
const user_1 = require("./user");
class Match {
    constructor(player1, player2, isTournament, tournament_id) {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.player1 = player1;
        this.player2 = player2;
        this.winner = null;
        this.score = "0 - 0";
        this.created_at = new Date();
        this.is_tournament = isTournament;
        this.tournament_id = tournament_id ? tournament_id : null;
    }
    pushMatchToDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id !== 0) {
                _1.server.log.error(`Match ${this.id} already exists in the DB`);
                return "Match already exists";
            }
            _1.server.log.info(`${this.player1}`);
            try {
                const insertMatch = _2.db.prepare(`
                INSERT INTO matchs (player1, player2, winner, score, created_at, is_tournament, tournament_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `);
                _2.db.transaction(() => {
                    const result = insertMatch.run(this.player1, this.player2, this.winner, this.score, Number(this.created_at), this.is_tournament ? 1 : 0, this.tournament_id);
                    this.id = result.lastInsertRowid;
                })();
                _1.server.log.info(`Match ${this.id} added to the DB`);
                return null;
            }
            catch (error) {
                _1.server.log.error(`Error while adding match ${this.id} to the DB: ${error}`);
                return "Error while adding match to the DB";
            }
        });
    }
    deleteMatchInDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id === 0) {
                _1.server.log.error(`Match ${this.id} doesn't exist in the DB`);
                return "Match doesn't exist";
            }
            try {
                const deleteMatch = _2.db.prepare(`DELETE FROM matchs WHERE id = ?`);
                _2.db.transaction(() => {
                    deleteMatch.run(this.id);
                })();
                _1.server.log.info(`Match ${this.id} deleted from the DB`);
                return null;
            }
            catch (error) {
                _1.server.log.error(`Error while deleting match ${this.id} from the DB: ${error}`);
                return "Error while deleting match from the DB";
            }
        });
    }
    updateMatchInDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id === 0) {
                _1.server.log.error(`Match ${this.id} doesn't exist in the DB`);
                return "Match doesn't exist";
            }
            try {
                //If both players are deleted, delete the match
                if (this.player1 == null && this.player2 == null && this.is_tournament == false) {
                    this.deleteMatchInDb();
                    return "Match deleted because both players no longer exist";
                }
                const updateMatch = _2.db.prepare(`
                UPDATE matchs
                SET player1 = ?, player2 = ?, winner = ?, created_at = ?, score = ?, is_tournament = ?
                WHERE id = ?
                `);
                _2.db.transaction(() => {
                    updateMatch.run(this.player1, this.player2, this.winner, Number(this.created_at), this.score, this.is_tournament ? 1 : 0, this.id);
                })();
                _1.server.log.info(`Match ${this.id} updated in the DB`);
                return null;
            }
            catch (error) {
                _1.server.log.error(`Error while updating match ${this.id} in the DB: ${error}`);
                return "Error while updating match in the DB";
            }
        });
    }
}
exports.Match = Match;
function getMatchFromDb(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlRequest = `SELECT * FROM matchs WHERE id = ?`;
            const matchRow = _2.db.prepare(sqlRequest).get(id);
            if (!matchRow)
                return null;
            let match = new Match(matchRow.player1, matchRow.player2, matchRow.is_tournament ? true : false);
            match.id = matchRow.id;
            match.score = matchRow.score;
            match.created_at = new Date(matchRow.created_at);
            match.tournament_id = matchRow.tournament_id;
            if (matchRow.winner != null) {
                if ((yield (0, user_1.getUserFromDb)(Number(matchRow.winner))) == null) {
                    match.winner = "Deleted user";
                }
                else {
                    match.winner = matchRow.winner;
                }
            }
            if ((yield (0, user_1.getUserFromDb)(Number(matchRow.player1))) == null) {
                match.player1 = "Deleted user";
            }
            if ((yield (0, user_1.getUserFromDb)(Number(matchRow.player2))) == null) {
                match.player2 = "Deleted user";
            }
            if (match.player1 === "Deleted user" && match.player2 === "Deleted user") {
                yield match.deleteMatchInDb();
                return null;
            }
            return match;
        }
        catch (error) {
            _1.server.log.error(`Error while getting match ${id} from the DB: ${error}`);
            return null;
        }
    });
}
