"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTime = getCurrentTime;
exports.keepAliveRoute = keepAliveRoute;
const user_1 = require("../user");
function getCurrentTime() {
    return Date.now();
}
async function keepAliveRoute(server) {
    server.post('/keep-alive', async (request, reply) => {
        const { id } = request.body;
        const user = await (0, user_1.getUserFromDb)(id);
        if (user == null) {
            reply.code(404).send({ error: "User not found" });
            return;
        }
        const current_time = getCurrentTime();
        user.is_online = true;
        user.last_login = new Date(current_time);
        user.updateUserInDb();
    });
}
