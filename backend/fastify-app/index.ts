import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { userRoutes } from "./routes/user";
import { tournamentRoutes } from "./routes/tournaments";
import { matchsRoutes } from "./routes/matchs";

const Port = process.env.PORT || 4321
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
    logger: true
});


server.get('/ping', async (request, reply) => {
    return 'pong\n'
})

const start = async () => {
    try {
        await server.register(metrics,{endpoint: '/metrics'})
        await server.register(tournamentRoutes);
        await server.register(userRoutes);
        await server.register(matchsRoutes);
        await server.listen({ port: Number(Port) , host: '0.0.0.0'})
        console.log('Server started sucessfully')
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start();

