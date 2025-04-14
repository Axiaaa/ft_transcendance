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



// const registerRateLimit = async () => {
//   await server.register(rateLimit, {
//     max: 10, // ⏱ 60 requests per...
//     timeWindow: '1 minute', // ...per minute per IP
//     addHeaders: {
//       'x-ratelimit-limit': true,
//       'x-ratelimit-remaining': true,
//       'x-ratelimit-reset': true,
//     },
//     errorResponseBuilder: () => {
//       return {
  //         statusCode: 429,
  //         error: 'Too Many Requests',
  //         message: 'Vous avez dépassé la limite de requêtes (60/minute). Réessayez plus tard.',
  //       };
  //     },
  //   });
  // };

server.addHook('preHandler', async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  
    // const base64Credentials = authHeader.split(' ')[1];
    // const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    // const [username, password] = credentials.split(':');
  
    // if (username !== envUser || password !== envPassword) {
    //   return reply.code(401).send({ error: 'Unauthorized. Please provid valid credentials' });
    // }

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
        //await registerRateLimit();
        await server.register(rateLimit, {
          global: false, // Global rate limiting is disabled so we can set it route by route
        });
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

