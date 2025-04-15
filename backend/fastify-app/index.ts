import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { userRoutes } from "./routes/user";
import { matchsRoutes } from "./routes/matchs";
import rateLimit from '@fastify/rate-limit';
import { keepAliveRoute } from "./routes/keep_alive";
import { uploadRoutes } from "./routes/upload";
import multipart from '@fastify/multipart';


const Port = process.env.PORT || 4321
const envUser = process.env.API_USERNAME || 'admin'
const envPassword = process.env.API_PASSWORD || 'admin'
export const salt = process.env.SALT || 'salt'
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
    logger: true
});

server.addHook('preHandler', async (req, reply) => {
  if (req.url.startsWith('/api/users/login')) {
    return;
  }
 
    const authHeader = req.headers.authorization;
    server.log.info('Auth Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) 
      return reply.code(401).send({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    let tokenExists;
    try {
        tokenExists = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
    } catch (error) {
        server.log.error('Database query failed:', error);
        return reply.code(500).send({ error: 'Internal Server Error' });
    }

    if (!tokenExists) {
      return reply.code(401).send({ error: 'Unauthorized' });
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
        await server.register(multipart);
        await server.register(rateLimit, {global: false});
        await server.register(metrics,{endpoint: '/metrics'});
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

