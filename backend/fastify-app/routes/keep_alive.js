"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTime = getCurrentTime;
exports.keepAliveRoute = keepAliveRoute;
const user_1 = require("../user");
function getCurrentTime() {
    return Date.now();
}
function keepAliveRoute(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post('/keep-alive', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.body;
            const user = yield (0, user_1.getUserFromDb)(id);
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const current_time = getCurrentTime();
            user.is_online = true;
            user.last_login = new Date(current_time);
            user.updateUserInDb();
        }));
    });
}
