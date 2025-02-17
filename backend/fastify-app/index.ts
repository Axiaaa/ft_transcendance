import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { User } from "./user";
import { getUserFromDb  } from "./user";

const Port = process.env.PORT || 4321
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
    logger: true
});

server.get('/users', async () => {
    return db.prepare('SELECT * FROM users').all();
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
    if (username) { user.name = username }
    if (email) { user.email = email }
    if (password) { user.password = password; }
    if (is_online) { user.is_online = is_online; }
    if (avatar) { user.avatar = avatar; }
    if (win_nbr) { user.win_nbr = win_nbr; }
    if (loss_nbr) { user.loss_nbr = loss_nbr; }
    await user.updateUserInDb();
    reply.code(204).send();
});

server.get('/ping', async (request, reply) => {
    return 'pong\n'
})

const start = async () => {
    try {
        await server.register(metrics,{endpoint: '/metrics'})
        await server.listen({ port: Number(Port) , host: '0.0.0.0'})
        console.log('Server started sucessfully')
        let u : User = new User("test", "test@test.com", "test");
        await u.pushUserToDb();
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start();

