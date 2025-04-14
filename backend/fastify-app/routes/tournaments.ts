import { FastifyInstance } from "fastify";
import { server, db } from "..";
import { Tournament, getTournamentFromDb, getTournamentMembers } from "../tournaments";
import { getUserFromDb, User } from "../user";

declare module "fastify" {
  interface FastifyContextConfig {
    rateLimit?: unknown;
  }
}
import { RateLimits } from '../limit_rate';

export async function tournamentRoutes(server : FastifyInstance) {
    
    server.route<{
        Params: { id: string }
      }>({
        method: 'GET',
        url: '/tournaments/:id',
        config: {
            rateLimit: RateLimits.Tournament,
        },
        handler: async (request, reply) => {
        const { id } = request.params;
        const tournament = await getTournamentFromDb(Number(id));
        if (tournament != null)
            return tournament;
        else 
            reply.code(404).send({error: "Tournament not found"});
        }
        });
    
    server.route ({
        method: 'GET',
        url: '/tournaments',
        config: {
            rateLimit: RateLimits.Tournament,
        },
        handler: async (request, reply) => {
        const tournaments = db.prepare('SELECT * FROM tournaments').all();
        const result =  await Promise.all(tournaments.map(async (tournament: any) => {
            return await getTournamentFromDb(tournament.id);
        })).then(tournaments => tournaments.filter(tournament => tournament !== null));
        if (result.length === 0) {
            reply.code(404).send({ error: "No tournaments found" });
            return;
        }
        reply.code(200).send(result);
    }
    });
    
    server.route<{
        Body: {
        name: string,
        password?: string,
        type: number,
        creator_id: number,
        duration?: number,
        }
        }>({
            method: 'POST',
            url: '/tournaments',
            config: {
                rateLimit: RateLimits.Tournament,
            },
        handler: async (request, reply) => {
        const { name, password, type, creator_id, duration } = request.body;
        const creator = await getUserFromDb(creator_id);
        if (creator == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const tournament = new Tournament(name, type, creator, password, duration);
        const req_message = await tournament.pushTournamentToDb();
            req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(201).send({ id: tournament.id });
        },
    });
    
    server.route<{
        Params: { id: string },
        Body: {
          name?: string, 
          password?: string,
          type?: number,
          creator_id?: number,
          winner_id?: number,
          duration?: number,
        }
      }>({
        method: 'PATCH',
        url: '/tournaments/:id',
        config: {
          rateLimit: RateLimits.Tournament,
        },
        handler: async (request, reply) => {
          const { id } = request.params;
          const { name, password, type, creator_id, winner_id, duration } = request.body;
          let tournament = await getTournamentFromDb(Number(id));
      
          if (!tournament) {
            reply.code(404).send({ error: "Tournament not found" });
            return;
          }
      
          if (name) tournament.name = name;
          if (password) tournament.password = password;
          if (type) tournament.type = type;
          if (duration) tournament.duration = duration;
      
          if (creator_id) {
            const creator = await getUserFromDb(creator_id);
            if (!creator) {
              reply.code(404).send({ error: "User not found" });
              return;
            }
            tournament.creator = creator;
          }
      
          if (winner_id) {
            const winner = await getUserFromDb(winner_id);
            if (!winner) {
              reply.code(404).send({ error: "User not found" });
              return;
            }
            if (!tournament.members.includes(winner_id)) {
              reply.code(409).send({ error: "The winner is not a member of the tournament" });
              return;
            }
            tournament.winner = winner;
          }
      
          const req_message = await tournament.updateTournamentInDb();
          req_message != null
            ? reply.code(409).send({ error: req_message })
            : reply.code(204).send();
        }
      });

    server.route<{
        Params: { id: string }
      }>({
        method: 'GET',
        url: '/tournaments/:id/members',
        config: {
            rateLimit: RateLimits.Tournament,
        },
        handler: async (request, reply) => {
         const { id } = request.params;
        const members = await getTournamentMembers(Number(id));
        if (members != null)
            return members.map(member => member.id);
        else 
            reply.code(404).send({error: "Tournament not found"});
        }
    });
    
    server.route<{
        Params: { tournament_id: number },
        Body: { user_id: number }
      }>({
        method: 'POST',
        url: '/tournaments/:tournament_id/members',
        config: {
          rateLimit: RateLimits.Tournament,
        },
        handler: async (request, reply) => {
          const { user_id } = request.body;
          const { tournament_id } = request.params;
          const tournament = await getTournamentFromDb(tournament_id);
          if (!tournament) {
            reply.code(404).send({ error: "Tournament not found" });
            return;
          }
          const user = await getUserFromDb(user_id);
          if (!user) {
            reply.code(404).send({ error: "User not found" });
            return;
          }
          const req_message = await tournament.addMember(user);
          req_message != null
            ? reply.code(409).send({ error: req_message })
            : reply.code(204).send();
        }
      });
    
    server.route<{
        Params: { tournament_id: string, user_id: string }
      }>({
        method: 'DELETE',
        url: '/tournaments/:tournament_id/members/:user_id',
        config: {
            rateLimit: RateLimits.Tournament,
        },
        handler: async (request, reply) => {
        const { tournament_id, user_id } = request.params;
        const tournament = await getTournamentFromDb(Number(tournament_id));
        if (tournament == null) {
            reply.code(404).send({error: "Tournament not found"});
            return;
        }
        const user = await getUserFromDb(Number(user_id));
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        let req_message = await tournament.removeMember(user);
        if (tournament.members.length != 0) 
            req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
        else {
            req_message = await tournament.deleteTournamentFromDb();
            req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
        }
    }
});
    
    server.route<{
        Params: { id: string }
      }>({
        method: 'DELETE',
        url: '/tournaments/:id',
        config: {
            rateLimit: RateLimits.Tournament,
        },
        handler: async (request, reply) => {
        const { id } = request.params;
        const tournament = await getTournamentFromDb(Number(id));
    
        if (tournament == null) {
            reply.code(404).send({error: "Tournament not found"});
            return;
        }
        const req_message = await tournament.deleteTournamentFromDb();
        req_message != null ? reply.code(409).send({ error: req_message }) : reply.code(204).send();
        }
});
    

}