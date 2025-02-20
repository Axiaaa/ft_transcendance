import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { User } from "./user";
import { getUserFromDb  } from "./user";
import { Tournament, getTournamentFromDb, getTournamentMembers } from "./tournaments";


const Port = process.env.PORT || 4321
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
    logger: true
});

server.get('/users', async () => {
    const users = db.prepare('SELECT * FROM users').all();
    return await Promise.all(users.map((user: any) => {
        const newUser = new User(user.username, user.email, user.password);
        newUser.id = user.id;
        return newUser;
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

