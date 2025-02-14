import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"


const Port = process.env.PORT || 4321
// export const db = new database(`/usr/src/app/db/database.db`)
export const db = null;

const server = fastify({
    logger: true
});

// db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL
//         )
//         `)
//         .run();
        

// server.get('/users', async () => {
//     return db.prepare('SELECT * FROM users').all();
// });

// server.post<{ Params: { id: string }; Body: { name: string } }>('/users/:id', async (request, reply) => {
//     const { id } = request.params;
//     const { name } = request.body;
//     const stmt = db.prepare('INSERT INTO users (id, name) VALUES (?, ?)');
//     stmt.run(id, name);
//     reply.send({ success: true });
// });

// server.get('/ping', async (request, reply) => {
//     return 'pong\n'
// })

const start = async () => {
    try {
        await server.register(metrics,{endpoint: '/metrics'})
        await server.listen({ port: Number(Port) , host: '0.0.0.0'})
        console.log('Server started sucessfully')
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start();

