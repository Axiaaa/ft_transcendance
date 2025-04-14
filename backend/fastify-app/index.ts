import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { userRoutes } from "./routes/user";
import { tournamentRoutes } from "./routes/tournaments";
import { matchsRoutes } from "./routes/matchs";
import rateLimit from '@fastify/rate-limit';
import { keepAliveRoute } from "./routes/keep_alive";

const Port = process.env.PORT || 4321
const envUser = process.env.API_USERNAME || 'admin'
const envPassword = process.env.API_PASSWORD || 'admin'
export const salt = process.env.SALT || 'salt'
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
    logger: true
});

server.addHook('preHandler', async (req, reply) => {
  if (req.url === '/api/users' && req.method === 'POST') {
    return;
    /// Allow unauthenticated access to user creation
  }

  if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PATCH') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const tokenExists = db.prepare('SELECT 1 FROM tokens WHERE token = ?').get(token);

    if (!tokenExists) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
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
        await server.register(rateLimit, {global: false});
        await server.register(metrics,{endpoint: '/metrics'});
        await server.register(tournamentRoutes, { prefix: '/api' });
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

