import { get } from 'http';
import { db } from '..';
import { Match, getMatchFromDb } from '../matchs';
import { FastifyInstance } from 'fastify';
import { getUserFromDb } from '../user';

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
    
    server.get('/matchs', async () => {
        const matchs = db.prepare('SELECT * FROM matchs').all();
        return await Promise.all(matchs.map((tmp: any) => {
            return getMatchFromDb(tmp.id);
        }));
    });

    server.post<{ Body: { player1: number, player2: number, is_tournament: boolean } }>('/matchs', async (request, reply) => {
        const { player1, player2, is_tournament } = request.body;
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
        const match = new Match(player1.toString(), player2.toString(), is_tournament);
        const req_message = await match.pushMatchToDb();        
        if (match.id != 0) 
            reply.code(201).send({ id: match.id });
         else
            reply.code(409).send({ error: req_message });
    });
}