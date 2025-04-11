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
exports.matchsRoutes = matchsRoutes;
const __1 = require("..");
const matchs_1 = require("../matchs");
const user_1 = require("../user");
const tournaments_1 = require("../tournaments");
function matchsRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/matchs/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const matchId = request.params.id;
            const match = yield (0, matchs_1.getMatchFromDb)(Number(matchId));
            if (match === null) {
                reply.code(404).send({ error: "Match not found" });
            }
            else {
                reply.send(match);
            }
        }));
        server.get('/matchs', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const matchs = __1.db.prepare('SELECT * FROM matchs').all();
            const result = yield Promise.all(matchs.map((tmp) => __awaiter(this, void 0, void 0, function* () {
                const match = yield (0, matchs_1.getMatchFromDb)(tmp.id);
                return match !== null ? match : null;
            }))).then(matches => matches.filter(match => match !== null));
            if (result.length === 0) {
                reply.code(404).send({ error: "No matches found" });
                return;
            }
            reply.code(200).send(result);
        }));
        server.post('/matchs', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { player1, player2, is_tournament, tournament_id } = request.body;
            const u1 = yield (0, user_1.getUserFromDb)(player1);
            const u2 = yield (0, user_1.getUserFromDb)(player2);
            if (u1 == null || u2 == null) {
                reply.code(404).send({ error: "One of the players does not exist" });
                return;
            }
            if (player1 == player2) {
                reply.code(404).send({ error: "The two players must be different" });
                return;
            }
            if (is_tournament == true) {
                if (tournament_id) {
                    if ((yield (0, tournaments_1.getTournamentFromDb)(tournament_id)) == null) {
                        reply.code(409).send({ error: "The tournament doesn't exists" });
                        return;
                    }
                }
                else {
                    reply.code(400).send({ error: "The tournament ID isn't specified" });
                    return;
                }
            }
            const match = new matchs_1.Match(player1.toString(), player2.toString(), is_tournament, is_tournament ? tournament_id : undefined);
            const req_message = yield match.pushMatchToDb();
            req_message === null ? reply.code(201).send({ id: match.id }) : reply.code(409).send({ error: req_message });
        }));
        server.patch('/matchs/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { player1, player2, winner, created_at, score, is_tournament } = request.body;
            const matchId = request.params.id;
            let match = yield (0, matchs_1.getMatchFromDb)(Number(matchId));
            if (match == null) {
                reply.code(404).send({ error: "Match not found" });
                return;
            }
            if (player1 != null && (yield (0, user_1.getUserFromDb)(player1)) == null ||
                player2 != null && (yield (0, user_1.getUserFromDb)(player2)) == null ||
                winner != null && (yield (0, user_1.getUserFromDb)(winner)) == null) {
                reply.code(409).send({ error: "One of the players or the winner does not exist" });
                return;
            }
            if (player1) {
                if (player1.toString() == match.player2) {
                    reply.code(409).send({ error: "The two players must be different" });
                    return;
                }
            }
            if (player2) {
                if (player2.toString() == match.player1) {
                    reply.code(409).send({ error: "The two players must be different" });
                    return;
                }
            }
            if (player1)
                match.player1 = player1.toString();
            if (player2)
                match.player2 = player2.toString();
            if (winner !== undefined) {
                match.winner = (winner === null ? null : winner.toString());
            }
            if (score)
                match.score = score;
            if (is_tournament)
                match.is_tournament = is_tournament;
            const req_message = yield match.updateMatchInDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
        }));
        server.delete('/matchs/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const matchId = request.params.id;
            const match = yield (0, matchs_1.getMatchFromDb)(Number(matchId));
            if (match == null) {
                reply.code(404).send({ error: "Match not found" });
                return;
            }
            const req_message = yield match.deleteMatchInDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
        }));
    });
}
