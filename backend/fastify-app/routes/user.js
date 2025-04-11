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
exports.userRoutes = userRoutes;
const user_1 = require("../user");
const __1 = require("..");
const user_2 = require("../user");
function userRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/users', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const users = __1.db.prepare('SELECT * FROM users').all();
            const result = yield Promise.all(users.map((tmp) => __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, user_2.getUserFromDb)(tmp.id);
                return user !== null ? user : null;
            }))).then(users => users.filter(user => user !== null));
            if (result.length === 0) {
                reply.code(404).send({ error: "No users found" });
                return;
            }
            reply.code(200).send(result);
        }));
        server.get('/users/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            return user;
        }));
        server.post('/users', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = request.body;
            const user = new user_1.User(name, email, password);
            const req_message = yield user.pushUserToDb();
            req_message === null ? reply.code(201).send({ id: user.id }) : reply.code(409).send({ error: req_message });
        }));
        server.patch('/users/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { username, email, password, is_online, avatar, win_nbr, loss_nbr, background, last_login, font_size } = request.body;
            let user = yield (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            if (username) {
                user.username = username;
            }
            if (email) {
                user.email = email;
            }
            if (password) {
                user.password = password;
            }
            if (is_online) {
                user.is_online = is_online;
            }
            if (avatar) {
                user.avatar = avatar;
            }
            if (win_nbr) {
                user.win_nbr = win_nbr;
            }
            if (loss_nbr) {
                user.loss_nbr = loss_nbr;
            }
            if (background) {
                user.background = background;
            }
            if (last_login) {
                user.last_login = new Date(last_login);
            }
            if (font_size) {
                user.font_size = Math.max(10, Math.min(font_size, 20));
            }
            const req_message = yield user.updateUserInDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
        }));
        server.delete('/users/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const req_message = yield user.deleteUserFromDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
        }));
        server.get('/users/:id/friends', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            if (user.friend_list.length === 0) {
                reply.code(404).send({ error: "Empty friend list" });
                return;
            }
            return user.friend_list;
        }));
        server.post('/users/:id/friends', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { friend_id } = request.body;
            const user = yield (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = yield (0, user_2.getUserFromDb)(friend_id);
            if (friend == null) {
                reply.code(404).send({ error: "Friend not found" });
                return;
            }
            if (friend.id === user.id) {
                reply.code(409).send({ error: "Can't add yourself as a friend" });
                return;
            }
            if (user.friend_list.find(f => f === friend.id) == undefined) {
                const req_message = yield user.addFriend(friend.id);
                req_message === null ? reply.code(201).send({ id: user.id }) : reply.code(409).send({ error: req_message });
                return;
            }
            else
                reply.code(409).send({ error: "Friend already in friend list" });
        }));
        server.delete('/users/:user_id/friends/:friend_id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { user_id, friend_id } = request.params;
            const user = yield (0, user_2.getUserFromDb)(Number(user_id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = yield (0, user_2.getUserFromDb)(Number(friend_id));
            if (friend == null) {
                reply.code(404).send({ error: "Friend not found" });
                return;
            }
            if (user.friend_list.find(f => f === friend.id)) {
                const req_message = yield user.removeFriend(friend.id);
                req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
            }
            else
                reply.code(404).send({ error: "Friend not found in friend list" });
        }));
        server.get('/users/:id/pending_friends', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            if (user.pending_friend_list.length === 0) {
                reply.code(404).send({ error: "Empty pending friend list" });
                return;
            }
            return user.pending_friend_list;
        }));
        server.post('/users/:id/pending_friends', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { friend_id } = request.body;
            const user = yield (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = yield (0, user_2.getUserFromDb)(friend_id);
            if (friend == null) {
                reply.code(404).send({ error: "Friend not found" });
                return;
            }
            if (friend.id === user.id) {
                reply.code(409).send({ error: "Can't add yourself as a pending friend" });
                return;
            }
            if (user.friend_list.includes(friend.id)) {
                reply.code(409).send({ error: "Friend already in friend list" });
                return;
            }
            if (user.pending_friend_list.find(f => f === friend.id) == undefined) {
                const req_message = yield user.addPendingFriend(friend.id);
                req_message === null ? reply.code(201).send({ id: user.id }) : reply.code(409).send({ error: req_message });
                return;
            }
            else
                reply.code(409).send({ error: "Friend already in pending friend list" });
        }));
        server.delete('/users/:user_id/pending_friends/:friend_id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { user_id, friend_id } = request.params;
            const user = yield (0, user_2.getUserFromDb)(Number(user_id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = yield (0, user_2.getUserFromDb)(Number(friend_id));
            if (friend == null) {
                reply.code(404).send({ error: "Friend not found" });
                return;
            }
            if (user.pending_friend_list.find(f => f === friend.id)) {
                const req_message = yield user.removePendingFriend(friend.id);
                req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
            }
            else
                reply.code(404).send({ error: "Friend not found in pending friend list" });
        }));
    });
}
