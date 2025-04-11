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
exports.Tournament = void 0;
exports.getTournamentFromDb = getTournamentFromDb;
exports.getTournamentMembers = getTournamentMembers;
const _1 = require(".");
const user_1 = require("./user");
class Tournament {
    constructor(name, type, creator, password, duration) {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.name = name;
        this.password = password ? password : null;
        this.members = new Array();
        this.matches = new Array();
        this.creator = creator;
        this.winner = null;
        this.created_at = new Date();
        this.duration = duration ? duration : 0;
        this.type = type;
        this.members.push(creator.id);
    }
    addMember(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.members.find(member => member === user.id)) {
                _1.server.log.error(`User ${user.username} is already in the tournament ${this.name}`);
                return "User is already in the tournament";
            }
            this.members.push(user.id);
            const req_message = this.updateTournamentInDb();
            return req_message;
        });
    }
    removeMember(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.members.findIndex(member => member === user.id);
            if (index === -1) {
                _1.server.log.error(`User ${user.username} is not in the tournament ${this.name}`);
                return "User is not in the tournament";
            }
            this.members.splice(index, 1);
            const req_message = this.updateTournamentInDb();
            return req_message;
        });
    }
    pushTournamentToDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id !== 0) {
                _1.server.log.error(`Tournament ${this.name} already exists in the DB`);
                return "Tournament already exists";
            }
            try {
                const insertTournament = _1.db.prepare(`INSERT INTO tournaments (name, password, creator_id, created_at, duration, type) VALUES (?, ?, ?, ?, ?, ?)`);
                const insertMember = _1.db.prepare(`INSERT INTO tournament_members (tournament_id, user_id) VALUES (?, ?)`);
                _1.db.transaction(() => {
                    const result = insertTournament.run(this.name, this.password, this.creator.id, Number(this.created_at), this.duration, this.type.valueOf());
                    this.id = result.lastInsertRowid;
                    this.members.forEach(member => {
                        insertMember.run(this.id, member);
                    });
                })();
                _1.server.log.info(`Tournament ${this.name} created successfully`);
                return null;
            }
            catch (error) {
                _1.server.log.error(`Error while creating tournament ${this.name} : ${error}`);
                return "Error while creating tournament";
            }
        });
    }
    updateTournamentInDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id === 0) {
                _1.server.log.error(`Tournament ${this.name} does not exist in the DB`);
                return "Tournament doesn't exist";
            }
            try {
                const updateTournament = _1.db.prepare(`UPDATE tournaments SET name = ?, password = ?, creator_id = ?, created_at = ?, duration = ?, type = ?, winner = ? WHERE id = ?`);
                const deleteMembers = _1.db.prepare(`DELETE FROM tournament_members WHERE tournament_id = ?`);
                const insertMember = _1.db.prepare(`INSERT INTO tournament_members (tournament_id, user_id) VALUES (?, ?)`);
                _1.db.transaction(() => {
                    updateTournament.run(this.name, this.password, this.creator.id, Number(this.created_at), this.duration, this.type.valueOf(), this.winner ? this.winner.id : null, this.id);
                    deleteMembers.run(this.id);
                    this.members.forEach(member => {
                        insertMember.run(this.id, member);
                    });
                })();
                _1.server.log.info(`Tournament ${this.name} updated successfully`);
                return null;
            }
            catch (error) {
                _1.server.log.error(`Error while updating tournament ${this.name} : ${error}`);
                return "Error while updating tournament";
            }
        });
    }
    deleteTournamentFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id === 0) {
                _1.server.log.error(`Tournament ${this.name} does not exist in the DB`);
                return "Tournament does not exist";
            }
            try {
                const deleteTournament = _1.db.prepare(`DELETE FROM tournaments WHERE id = ?`);
                const deleteMembers = _1.db.prepare(`DELETE FROM tournament_members WHERE tournament_id = ?`);
                _1.db.transaction(() => {
                    deleteTournament.run(this.id);
                    deleteMembers.run(this.id);
                })();
                _1.server.log.info(`Tournament ${this.name} deleted successfully`);
                return null;
            }
            catch (error) {
                _1.server.log.error(`Error while deleting tournament ${this.name} : ${error}`);
                return "Error while deleting tournament";
            }
        });
    }
}
exports.Tournament = Tournament;
function getTournamentFromDb(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const sqlRequest = "SELECT * FROM tournaments WHERE id = ?";
            const getMatches = _1.db.prepare("SELECT id FROM matchs WHERE tournament_id = ?");
            const tournamentRow = _1.db.prepare(sqlRequest).get(id);
            if (!tournamentRow)
                return null;
            const matches = getMatches.all(id);
            const creator = yield (0, user_1.getUserFromDb)(tournamentRow.creator_id);
            if (creator == null)
                return null;
            let tournament = new Tournament(tournamentRow.name, tournamentRow.type, creator, tournamentRow.password, tournamentRow.duration);
            tournament.id = tournamentRow.id;
            tournament.created_at = new Date(tournamentRow.created_at);
            tournament.members = ((_a = (yield getTournamentMembers(tournamentRow.id))) === null || _a === void 0 ? void 0 : _a.map((user) => user.id)) || [];
            if (tournament.members.find(member => member === creator.id) === undefined)
                tournament.members.push(creator.id);
            tournament.matches = matches.map(match => match.id);
            tournament.winner = tournamentRow.winner ? yield (0, user_1.getUserFromDb)(tournamentRow.winner) : null;
            return tournament;
        }
        catch (error) {
            _1.server.log.error(`Error while getting tournament ${id} from the DB: ${error}`);
            return null;
        }
    });
}
function getTournamentMembers(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const members = _1.db.prepare("SELECT user_id FROM tournament_members WHERE tournament_id = ?").all(id);
            const users = yield Promise.all(members.map((member) => __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, user_1.getUserFromDb)(member.user_id);
                return user;
            })));
            return users.filter(user => user != null);
        }
        catch (error) {
            _1.server.log.error(`Error while getting members of tournament ${id} from the DB: ${error}`);
            return null;
        }
    });
}
