"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchsRoutes = matchsRoutes;
const __1 = require("..");
const matchs_1 = require("../matchs");
const user_1 = require("../user");
const tournaments_1 = require("../tournaments");
const limit_rate_1 = require("../limit_rate");
async function matchsRoutes(server) {
    server.route({
        method: 'GET',
        url: '/matchs/:id',
        config: {
            rateLimit: limit_rate_1.RateLimits.matchs,
        },
        handler: async (request, reply) => {
            const matchId = request.params.id;
            const match = await (0, matchs_1.getMatchFromDb)(Number(matchId));
            if (match === null) {
                reply.code(404).send({ error: "Match not found" });
            }
            else {
                reply.send(match);
            }
        }
    });
    server.route({
        method: 'GET',
        url: '/matchs',
        config: {
            rateLimit: limit_rate_1.RateLimits.matchs,
        },
        handler: async (request, reply) => {
            const matchs = __1.db.prepare('SELECT * FROM matchs').all();
            const result = await Promise.all(matchs.map(async (tmp) => {
                const match = await (0, matchs_1.getMatchFromDb)(tmp.id);
                return match !== null ? match : null;
            })).then(matches => matches.filter(match => match !== null));
            if (result.length === 0) {
                reply.code(404).send({ error: "No matches found" });
                return;
            }
            reply.code(200).send(result);
        }
    });
    server.route({
        method: 'POST',
        url: '/matchs',
        config: {
            rateLimit: limit_rate_1.RateLimits.matchs,
        },
        handler: async (request, reply) => {
            const { player1, player2, is_tournament, tournament_id } = request.body;
            const u1 = await (0, user_1.getUserFromDb)(player1);
            const u2 = await (0, user_1.getUserFromDb)(player2);
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
                    if (await (0, tournaments_1.getTournamentFromDb)(tournament_id) == null) {
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
            const req_message = await match.pushMatchToDb();
            req_message === null ? reply.code(201).send({ id: match.id }) : reply.code(409).send({ error: req_message });
        }
    });
    server.route({
        method: 'PATCH',
        url: '/matchs/:id',
        config: {
            rateLimit: limit_rate_1.RateLimits.matchs,
        },
        handler: async (request, reply) => {
            const { player1, player2, winner, created_at, score, is_tournament } = request.body;
            const matchId = request.params.id;
            let match = await (0, matchs_1.getMatchFromDb)(Number(matchId));
            if (match == null) {
                reply.code(404).send({ error: "Match not found" });
                return;
            }
            if (player1 != null && await (0, user_1.getUserFromDb)(player1) == null ||
                player2 != null && await (0, user_1.getUserFromDb)(player2) == null ||
                winner != null && await (0, user_1.getUserFromDb)(winner) == null) {
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
            const req_message = await match.updateMatchInDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
        }
    });
    server.route({
        method: 'DELETE',
        url: '/matchs/:id',
        config: {
            rateLimit: limit_rate_1.RateLimits.matchs,
        },
        handler: async (request, reply) => {
            const matchId = request.params.id;
            const match = await (0, matchs_1.getMatchFromDb)(Number(matchId));
            if (match == null) {
                reply.code(404).send({ error: "Match not found" });
                return;
            }
            const req_message = await match.deleteMatchInDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
        }
    });
}
