import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { User } from "./user";
import { getUserFromDb  } from "./user";
import { Tournament, getTournamentFromDb, getTournamentMembers } from "./tournaments";
import { get } from "node:https";


const Port = process.env.PORT || 4321
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
    logger: true
});

server.get('/users', async () => {
    const users = db.prepare('SELECT * FROM users').all();
    return await Promise.all(users.map((user: any) => {
        return getUserFromDb(user.id);
    }));
});


server.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const user = await getUserFromDb(Number(id));
    if (user != null)
        return user;
    else 
        reply.code(404).send({error: "User not found"});
    }
)

server.post<{ Body: { name: string, email: string, password: string } }>('/users', async (request, reply) => {
    const { name, email, password } = request.body;
    const user = new User(name, email, password);
    const req_message = await user.pushUserToDb();
    if (user.id != 0)
        reply.code(201).send({ id: user.id });
    else
        reply.code(409).send({ error: req_message });
});

server.patch<{
    Params: { id: string },
    Body : {
        username?: string, 
        email?: string, 
        password?: string, 
        is_online?: boolean, 
        avatar?: string,
        win_nbr?: number,
        loss_nbr?: number,
      }
    }>('/users/:id', async (request, reply) => {

    const { id } = request.params;
    const { username, email, password, is_online, avatar, win_nbr, loss_nbr } = request.body;
    let user = await getUserFromDb(Number(id));
    if (user == null) {
        reply.code(404).send({error: "User not found"});
        return;
    }
    if (username)   { user.username = username }
    if (email)      { user.email = email }
    if (password)   { user.password = password; }
    if (is_online)  { user.is_online = is_online; }
    if (avatar)     { user.avatar = avatar; }
    if (win_nbr)    { user.win_nbr = win_nbr; }
    if (loss_nbr)   { user.loss_nbr = loss_nbr; }
    await user.updateUserInDb();
    reply.code(204).send();
});

server.get('/ping', async (request, reply) => {
    return 'pong\n'
})

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

server.delete<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const user = await getUserFromDb(Number(id));

    if (user == null) {
        reply.code(404).send({error: "User not found"});
        return;
    }   
    await user.deleteUserFromDb();
    reply.code(204).send();
    }
);

server.get<{ Params: { id: string } }>('/users/:id/friends', async (request, reply) => {
    const { id } = request.params;
    const user = await getUserFromDb(Number(id));
    if (user == null) {
        reply.code(404).send({error: "User not found"});
        return;
    }
    return user.friend_list;
    }
);

server.post<{ Params: { id: string } , Body: { friend_id: number } }>('/users/:id/friends', async (request, reply) => {
    const { id } = request.params;
    const { friend_id } = request.body;
    const user = await getUserFromDb(Number(id));
    if (user == null) {
        reply.code(404).send({error: "User not found"});
        return;
    }
    const friend = await getUserFromDb(friend_id);
    if (friend == null) {
        reply.code(404).send({error: "Friend not found"});
        return;
    }
    user.addFriend(friend);
    reply.code(201).send();
    }
);

server.delete<{ Params: { user_id: string, friend_id: string } }>('/users/:user_id/friends/:friend_id', async (request, reply) => {
    const { user_id, friend_id } = request.params;
    const user = await getUserFromDb(Number(user_id));
    if (user == null) {
        reply.code(404).send({error: "User not found"});
        return;
    }
    const friend = await getUserFromDb(Number(friend_id));
    if (friend == null) {
        reply.code(404).send({error: "Friend not found"});
        return;
    }
    user.removeFriend(friend);
    reply.code(204).send();
    }
);

const start = async () => {
    try {
        await server.register(metrics,{endpoint: '/metrics'})
        await server.listen({ port: Number(Port) , host: '0.0.0.0'})
        console.log('Server started sucessfully')
        let u : User = new User("test", "test@test.com", "test");
        await u.pushUserToDb();
        let t : Tournament = new Tournament("Tournatest", "Tournatest111", 1, u);
        await t.pushTournamentToDb();
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start();

