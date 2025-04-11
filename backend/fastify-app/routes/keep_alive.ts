import { FastifyInstance } from "fastify";
import { getUserFromDb, User} from "../user";
import { server, db } from "..";

export function getCurrentTime(): number {
    return Date.now();
}

export async function keepAliveRoute(server : FastifyInstance) {

    server.post<{ Body: { id : number } }>('/keep-alive', async (request, reply) => {
        
        const { id } = request.body;

        const user = await getUserFromDb(id);
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const current_time = getCurrentTime();
        user.is_online = true;
        user.last_login = new Date(current_time);
        user.updateUserInDb();
    });
}
