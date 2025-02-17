import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { User } from "./user";
import { IUser } from "./user.d";
import { getUserFromDb  } from "./user";
import { STATUS_CODES } from "http";

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

