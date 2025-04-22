import { get } from 'http';
import { db } from '..';
import { Match, getMatchFromDb } from '../matchs';
import { FastifyInstance } from 'fastify';
import { getUserFromDb } from '../user';
declare module "fastify" {
    interface FastifyContextConfig {
      rateLimit?: unknown;
    }
  }
  import { RateLimits } from '../limit_rate';

export async function matchsRoutes(server : FastifyInstance) {
    
    server.route<{
        Params: { id: string }
      }>({
        method: 'GET',
        url: '/matchs/:id',
        config: {
          rateLimit: RateLimits.matchs,
        },
        handler: async (request, reply) => {
          const matchId = request.params.id;
          const match = await getMatchFromDb(Number(matchId));
          if (match === null) {
            reply.code(404).send({ error: "Match not found" });
          } else {
            reply.send(match);
          }
        }
      });
    
      server.route ({
        method: 'GET',
        url: '/matchs',
        config: {
            rateLimit: RateLimits.matchs,
        },
        handler: async (request, reply) => {
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
}});

    server.route<{
        Body: {
            player1?: string;
            player2?: string;
            winner?: string;
            created_at?: string;
            score?: string;
            token1?: string;
            token2?: string;
        }
        }>({
        method: 'POST',
        url: '/matchs',
        config: {
            rateLimit: RateLimits.matchs,
        },
        handler: async (request, reply) => {
        const { player1, player2, winner, created_at, score, token1, token2  } = request.body;
        const u1 = await getUserFromDb( { token : player1 });
        const u2 = await getUserFromDb( { token : player2 });
        if (u1 == null || u2 == null) {
            reply.code(404).send({ error: "One of the players does not exist" });
            return;
        }
        if (player1 == player2) {
            reply.code(404).send({ error: "The two players must be different" });
            return;
        }
        if (!winner || !score)
        {
            reply.code(400).send({ error: "Winner and score must be provided" });
            return;
        }
        if (!player1 || !player2) {
            reply.code(400).send({ error: "Both players must be provided" });
            return;
        }
        const user = await getUserFromDb({ token : token1 });
        if (user == null) {
          reply.code(404).send({ error: "invalid token" });
          return;
        }
        const user2 = await getUserFromDb({ token : token2 });
        if (user2 == null) {
          reply.code(404).send({ error: "invalid token" });
          return;
        }
        const match = new Match(player1.toString(), player2.toString(), false, winner.toString(), score.toString(), new Date(), 0);
        const req_message = await match.pushMatchToDb();        
        req_message === null ? reply.code(201).send({ id: match.id }) : reply.code(409).send({ error: req_message });
    }});

}
