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
exports.tournamentRoutes = tournamentRoutes;
const __1 = require("..");
const tournaments_1 = require("../tournaments");
const user_1 = require("../user");
function tournamentRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/tournaments/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const tournament = yield (0, tournaments_1.getTournamentFromDb)(Number(id));
            if (tournament != null)
                return tournament;
            else
                reply.code(404).send({ error: "Tournament not found" });
        }));
        server.get('/tournaments', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const tournaments = __1.db.prepare('SELECT * FROM tournaments').all();
            const result = yield Promise.all(tournaments.map((tournament) => __awaiter(this, void 0, void 0, function* () {
                return yield (0, tournaments_1.getTournamentFromDb)(tournament.id);
            }))).then(tournaments => tournaments.filter(tournament => tournament !== null));
            if (result.length === 0) {
                reply.code(404).send({ error: "No tournaments found" });
                return;
            }
            reply.code(200).send(result);
        }));
        server.post('/tournaments', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { name, password, type, creator_id, duration } = request.body;
            const creator = yield (0, user_1.getUserFromDb)(creator_id);
            if (creator == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const tournament = new tournaments_1.Tournament(name, type, creator, password, duration);
            const req_message = yield tournament.pushTournamentToDb();
            req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(201).send({ id: tournament.id });
        }));
        server.patch('/tournaments/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { name, password, type, creator_id, winner_id, duration } = request.body;
            let tournament = yield (0, tournaments_1.getTournamentFromDb)(Number(id));
            if (tournament == null) {
                reply.code(404).send({ error: "Tournament not found" });
                return;
            }
            if (name) {
                tournament.name = name;
            }
            if (password) {
                tournament.password = password;
            }
            if (type) {
                tournament.type = type;
            }
            if (duration) {
                tournament.duration = duration;
            }
            if (creator_id) {
                const creator = yield (0, user_1.getUserFromDb)(creator_id);
                if (creator == null) {
                    reply.code(404).send({ error: "User not found" });
                    return;
                }
                tournament.creator = creator;
            }
            if (winner_id) {
                const winner = yield (0, user_1.getUserFromDb)(winner_id);
                if (winner == null) {
                    reply.code(404).send({ error: "User not found" });
                    return;
                }
                if (tournament.members.find(member => member === winner_id) == null) {
                    reply.code(409).send({ error: "The winner is not a member of the tournament" });
                    return;
                }
                tournament.winner = winner;
            }
            const req_message = yield tournament.updateTournamentInDb();
            req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
        }));
        server.get('/tournaments/:id/members', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const members = yield (0, tournaments_1.getTournamentMembers)(Number(id));
            if (members != null)
                return members.map(member => member.id);
            else
                reply.code(404).send({ error: "Tournament not found" });
        }));
        server.post('/tournaments/:tournament_id/members', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { user_id } = request.body;
            const { tournament_id } = request.params;
            const tournament = yield (0, tournaments_1.getTournamentFromDb)(tournament_id);
            if (tournament == null) {
                reply.code(404).send({ error: "Tournament not found" });
                return;
            }
            const user = yield (0, user_1.getUserFromDb)(user_id);
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const req_message = yield tournament.addMember(user);
            req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
        }));
        server.delete('/tournaments/:tournament_id/members/:user_id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { tournament_id, user_id } = request.params;
            const tournament = yield (0, tournaments_1.getTournamentFromDb)(Number(tournament_id));
            if (tournament == null) {
                reply.code(404).send({ error: "Tournament not found" });
                return;
            }
            const user = yield (0, user_1.getUserFromDb)(Number(user_id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            let req_message = yield tournament.removeMember(user);
            if (tournament.members.length != 0)
                req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
            else {
                req_message = yield tournament.deleteTournamentFromDb();
                req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
            }
        }));
        server.delete('/tournaments/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const tournament = yield (0, tournaments_1.getTournamentFromDb)(Number(id));
            if (tournament == null) {
                reply.code(404).send({ error: "Tournament not found" });
                return;
            }
            const req_message = yield tournament.deleteTournamentFromDb();
            req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
        }));
    });
}
