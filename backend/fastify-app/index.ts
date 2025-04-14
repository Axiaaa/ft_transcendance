import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { userRoutes } from "./routes/user";
import { tournamentRoutes } from "./routes/tournaments";
import { matchsRoutes } from "./routes/matchs";
import { keepAliveRoute } from "./routes/keep_alive";
import { uploadRoutes } from "./routes/upload";

const Port = process.env.PORT || 4321
const envUser = process.env.API_USERNAME || 'admin'
const envPassword = process.env.API_PASSWORD || 'admin'
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
    logger: true
});

server.addHook('preHandler', async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
  
    if (username !== envUser || password !== envPassword) {
      return reply.code(401).send({ error: 'Unauthorized. Please provid valid credentials' });
    }

    if (req.method === 'POST' || req.method === 'PATCH') {
      try {
        JSON.parse(JSON.stringify(req.body));
      } catch (error) {
        return reply.code(400).send({ error: 'Invalid JSON body' });
      }
    }
});


server.get('/ping', async (request, reply) => {
    return 'pong\n'
})

const start = async () => {
    try {
        await server.register(metrics,{endpoint: '/metrics'});
        await server.register(tournamentRoutes, { prefix: '/api' });
        await server.register(uploadRoutes, { prefix: '/api' });
        await server.register(userRoutes, { prefix: '/api' });
        await server.register(matchsRoutes, { prefix: '/api' });
        await server.register(keepAliveRoute, { prefix: '/api' });
        await server.listen({ port: Number(Port) , host: '0.0.0.0'})
        console.log('Server started sucessfully')
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start();

