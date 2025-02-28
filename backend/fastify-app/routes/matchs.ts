import { get } from 'http';
import { db } from '..';
import { Match, getMatchFromDb } from '../matchs';
import { FastifyInstance } from 'fastify';
import { getUserFromDb } from '../user';
import { getTournamentFromDb } from '../tournaments';

export async function matchsRoutes(server : FastifyInstance) {
    
    server.get<{ Params : {id : string}}>('/matchs/:id', async (request, reply) => {

        const matchId = request.params.id;
        const match = await getMatchFromDb(Number(matchId));
        if (match === null) {
            reply.code(404).send({ error: "Match not found" });
        }
        else {
            reply.send(match);
        }
    });
    
    server.get('/matchs', async (request, reply) => {
        const matchs = db.prepare('SELECT * FROM matchs').all();
        const result = await Promise.all(matchs.map(async (tmp: any) => {
            const match = await getMatchFromDb(tmp.id);
            return match !== null ? match : null;
        })).then(matches => matches.filter(match => match !== null));
        if (result.length === 0) {
            reply.code(404).send({ error: "No matches found" });
            return;
        }
        reply.code(200).send(result);
    });

    server.post<{ Body: { player1: number, player2: number, is_tournament: boolean, tournament_id? : number} }>('/matchs', async (request, reply) => {
        const { player1, player2, is_tournament, tournament_id } = request.body;
        const u1 = await getUserFromDb(player1);
        const u2 = await getUserFromDb(player2);
        if (u1 == null || u2 == null) {
            reply.code(404).send({ error: "One of the players does not exist" });
            return;
        }
        if (player1 == player2) {
            reply.code(404).send({ error: "The two players must be different" });
            return;
        }
        if (tournament_id != null && await getTournamentFromDb(tournament_id) == null) {
            reply.code(404).send({ error: "Tournament does not exist" });
            return;
        }
        const match = new Match(player1.toString(), player2.toString(), is_tournament, is_tournament ? tournament_id : undefined);
        const req_message = await match.pushMatchToDb();        
        if (match.id != 0) 
            reply.code(201).send({ id: match.id });
         else
            reply.code(409).send({ error: req_message });
    });

    server.patch<{
        Params: { id: string }, Body  :
        {
            player1?: number;
            player2?: number;
            winner?: number | null;
            created_at?: string;
            score?: string;
            is_tournament?: boolean;
        }
        }>('/matchs/:id', async (request, reply) => {

        const { player1, player2, winner, created_at, score, is_tournament } = request.body;
        const matchId = request.params.id;
        let match = await getMatchFromDb(Number(matchId));
        if (match == null) {
            reply.code(404).send({error: "Match not found"});
            return;
        }
        
        if (player1 != null && await getUserFromDb(player1) == null ||
            player2 != null && await getUserFromDb(player2) == null ||
            winner != null && await getUserFromDb(winner) == null) {
            reply.code(409).send({ error: "One of the players does not exist" });
            return;
        }

        if (player1) { if (player1.toString() == match.player2) { reply.code(409).send({ error: "The two players must be different" }); return; } }
        if (player2) { if (player2.toString() == match.player1) { reply.code(409).send({ error: "The two players must be different" }); return; } }

        if (player1) match.player1 = player1.toString();
        if (player2) match.player2 = player2.toString();
        if (winner !== undefined) { match.winner = winner === null ? null : winner.toString(); }
        if (created_at ) match.created_at = new Date(created_at);
        if (score) match.score = score;
        if (is_tournament) match.is_tournament = is_tournament;

        server.log.info(match);
        const req_message = await match.updateMatchInDb();
        if (req_message != null) {
            reply.code(409).send({ error: req_message });
            return;
        }
        reply.code(204).send();
    });


    server.delete<{ Params: { id: string } }>('/matchs/:id', async (request, reply) => {
        const matchId = request.params.id;
        const match = await getMatchFromDb(Number(matchId));
        if (match == null) {
            reply.code(404).send({ error: "Match not found" });
            return;
        }
        const req_message = await match.deleteMatchInDb();
        if (req_message != null) {
            reply.code(409).send({ error: req_message });
            return;
        }
        reply.code(204).send();
    }
    );
}