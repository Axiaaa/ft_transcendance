import { FastifyInstance } from "fastify";
import { server, db } from "..";
import { Tournament, getTournamentFromDb, getTournamentMembers } from "../tournaments";
import { getUserFromDb, User } from "../user";

export async function tournamentRoutes(server : FastifyInstance) {
    

    server.get<{ Params: { id: string } }>('/tournaments/:id', async (request, reply) => {
        const { id } = request.params;
        const tournament = await getTournamentFromDb(Number(id));
        if (tournament != null)
            return tournament;
        else 
            reply.code(404).send({error: "Tournament not found"});
        }
    );
    
    server.get('/tournaments', async () => {
        const tournaments = db.prepare('SELECT * FROM tournaments').all();
        return await Promise.all(tournaments.map(async (tournament: any) => {
            const newTournament = new Tournament(tournament.name, tournament.password, tournament.type, tournament.creator);
            newTournament.id = tournament.id;
            newTournament.members = await getTournamentMembers(tournament.id) as Array<User>;
            newTournament.creator = await getUserFromDb(tournament.creator_id) as User;
            return newTournament;
        }));
    });
    
    server.post<{ Body:
        { 
        name: string,
        password: string,
        type: number,
        creator_id: number,
        duration?: number,
        }
        }>('/tournaments', async (request, reply) => {
        
        const { name, password, type, creator_id, duration } = request.body;
        const creator = await getUserFromDb(creator_id);
        if (creator == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const tournament = new Tournament(name, password, type, creator, duration);
        const req_message = await tournament.pushTournamentToDb();
        if (tournament.id != 0)
            reply.code(201).send({ id: tournament.id });
        else
            reply.code(409).send({ error: req_message });
    });
    
    server.patch<{
        Params: { id: string },
        Body : {
            name?: string, 
            password?: string,
            type?: number,
            creator_id?: number,
            duration?: number,
            }
        }>('/tournaments/:id', async (request, reply) => {
            
        const { id } = request.params;
        const { name, password, type, creator_id, duration } = request.body;
        let tournament = await getTournamentFromDb(Number(id));
    
        if (tournament == null) {
            reply.code(404).send({error: "Tournament not found"});
            return;
        }
        if (name)       { tournament.name = name }
        if (password)   { tournament.password = password }
        if (type)       { tournament.type = type }
        if (creator_id) {
            const creator = await getUserFromDb(creator_id);
            if (creator == null) {
                reply.code(404).send({error: "User not found"});
                return;
            }
            tournament.creator = creator;
        }
        if (duration)   { tournament.duration = duration }
        await tournament.updateTournamentInDb();
        reply.code(204).send();
        }
    );
    
    
    server.get<{ Params : {id : string} }>('/tournaments/:id/members', async (request, reply) => {
        const { id } = request.params;
        const members = await getTournamentMembers(Number(id));
        if (members != null)
            return members;
        else 
            reply.code(404).send({error: "Tournament not found"});
        }
    );
    
    server.post<{ Body: { tournament_id: number, user_id: number } }>('/tournaments/:tournament_id/members', async (request, reply) => {
        const { tournament_id, user_id } = request.body;
        const tournament = await getTournamentFromDb(tournament_id);
        if (tournament == null) {
            reply.code(404).send({error: "Tournament not found"});
            return;
        }
        const user = await getUserFromDb(user_id);
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const req_message = await tournament.addMember(user);
        if (req_message != null)
            reply.code(409).send({ error: req_message });
        else 
            reply.code(201).send();
    });
    
    server.delete<{ Params: { tournament_id: string, user_id: string } }>('/tournaments/:tournament_id/members/:user_id', async (request, reply) => {
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
        const req_message = await tournament.removeMember(user);
        if (req_message != null)
            reply.code(409).send({ error: req_message });
        else 
            reply.code(204).send();
    }
    );
    
    server.delete<{ Params: { id: string } }>('/tournaments/:id', async (request, reply) => {
        const { id } = request.params;
        const tournament = await getTournamentFromDb(Number(id));
    
        if (tournament == null) {
            reply.code(404).send({error: "Tournament not found"});
            return;
        }   
        await tournament.deleteTournamentFromDb();
        reply.code(204).send();
    }
    );
    

}