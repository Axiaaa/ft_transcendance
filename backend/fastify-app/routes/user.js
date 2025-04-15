"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const user_1 = require("../user");
const __1 = require("..");
const user_2 = require("../user");
const limit_rate_1 = require("../limit_rate");
const crypto_1 = __importDefault(require("crypto"));
async function userRoutes(server) {
    server.route({
        method: 'GET',
        url: '/users',
        config: {
            rateLimit: limit_rate_1.RateLimits.login,
        },
        handler: async (request, reply) => {
            const users = __1.db.prepare('SELECT * FROM users').all();
            const result = await Promise.all(users.map(async (tmp) => {
                const user = await (0, user_2.getUserFromDb)(tmp.id);
                return user !== null ? user : null;
            })).then(users => users.filter(user => user !== null));
            if (result.length === 0) {
                reply.code(404).send({ error: "No users found" });
                return;
            }
            reply.code(200).send(result);
        }
    });
    server.route({
        method: 'GET',
        url: '/users/:id',
        config: {
            rateLimit: limit_rate_1.RateLimits.login,
        },
        handler: async (request, reply) => {
            const { id } = request.params;
            const user = await (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            reply.code(200).send(user);
        }
    });
    server.route({
        method: 'GET',
        url: '/users/login',
        config: {
            rateLimit: limit_rate_1.RateLimits.login,
        },
        handler: async (request, reply) => {
            const { username, password } = request.query;
            if (!username || !password) {
                reply.code(400).send({ error: "Username and password are required" });
                return;
            }
            const user = await (0, user_1.getUserFromHash)(username, password);
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            user.token = crypto_1.default.randomBytes(32).toString('hex');
            reply.code(200).send(user);
        }
    });
    server.route({
        method: 'POST',
        url: '/users/login',
        config: {
            rateLimit: limit_rate_1.RateLimits.login,
        },
        handler: async (request, reply) => {
            const { username, password } = request.body;
            if (!username || !password) {
                reply.code(400).send({ error: "Username and password are required" });
                return;
            }
            const existingUser = await (0, user_1.getUserFromHash)(username, password);
            if (existingUser) {
                reply.code(409).send({ error: "Username already exists" });
                return;
            }
            const user = new user_1.User(username, password);
            user.pushUserToDb();
            reply.code(201).send({ id: user.id, token: user.token });
        }
    });
    server.route({
        method: 'PATCH',
        url: '/users/:id',
        config: {
            rateLimit: limit_rate_1.RateLimits.patch_user,
        },
        handler: async (request, reply) => {
            const { id } = request.params;
            const { username, email, password, is_online, avatar, win_nbr, loss_nbr, background, last_login, font_size } = request.body;
            let user = await (0, user_2.getUserFromDb)(Number(id));
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
            const req_message = await user.updateUserInDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
        }
    });
    server.route({
        method: 'DELETE',
        url: '/users/:id',
        config: {
            rateLimit: limit_rate_1.RateLimits.delete_user,
        },
        handler: async (request, reply) => {
            const { id } = request.params;
            const user = await (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const req_message = await user.deleteUserFromDb();
            req_message === null
                ? reply.code(204).send()
                : reply.code(409).send({ error: req_message });
        },
    });
    server.route({
        method: 'GET',
        url: '/users/:id/friends',
        config: {
            rateLimit: limit_rate_1.RateLimits.friends,
        },
        handler: async (request, reply) => {
            const { id } = request.params;
            const user = await (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            if (user.friend_list.length === 0) {
                reply.code(404).send({ error: "Empty friend list" });
                return;
            }
            return user.friend_list;
        }
    });
    server.route({
        method: 'POST',
        url: '/users/:id/friends',
        config: {
            rateLimit: limit_rate_1.RateLimits.friends,
        },
        handler: async (request, reply) => {
            const { id } = request.params;
            const { friend_id } = request.body;
            const user = await (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = await (0, user_2.getUserFromDb)(friend_id);
            if (friend == null) {
                reply.code(404).send({ error: "Friend not found" });
                return;
            }
            if (friend.id === user.id) {
                reply.code(409).send({ error: "Can't add yourself as a friend" });
                return;
            }
            if (user.friend_list.find(f => f === friend.id) == undefined) {
                const req_message = await user.addFriend(friend.id);
                req_message === null ? reply.code(201).send({ id: user.id }) : reply.code(409).send({ error: req_message });
                return;
            }
            else
                reply.code(409).send({ error: "Friend already in friend list" });
        }
    });
    server.route({
        method: 'DELETE',
        url: '/users/:user_id/friends/:friend_id',
        config: {
            rateLimit: limit_rate_1.RateLimits.friends,
        },
        handler: async (request, reply) => {
            const { user_id, friend_id } = request.params;
            const user = await (0, user_2.getUserFromDb)(Number(user_id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = await (0, user_2.getUserFromDb)(Number(friend_id));
            if (friend == null) {
                reply.code(404).send({ error: "Friend not found" });
                return;
            }
            if (user.friend_list.find(f => f === friend.id)) {
                const req_message = await user.removeFriend(friend.id);
                req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
            }
            else
                reply.code(404).send({ error: "Friend not found in friend list" });
        }
    });
    server.route({
        method: 'GET',
        url: '/users/:id/pending_friends',
        config: {
            rateLimit: limit_rate_1.RateLimits.friends,
        },
        handler: async (request, reply) => {
            const { id } = request.params;
            const user = await (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            if (user.pending_friend_list.length === 0) {
                reply.code(404).send({ error: "Empty pending friend list" });
                return;
            }
            return user.pending_friend_list;
        }
    });
    server.route({
        method: 'POST',
        url: '/users/:id/pending_friends',
        config: {
            rateLimit: limit_rate_1.RateLimits.friends,
        },
        handler: async (request, reply) => {
            const { id } = request.params;
            const { friend_id } = request.body;
            const user = await (0, user_2.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = await (0, user_2.getUserFromDb)(friend_id);
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
                const req_message = await user.addPendingFriend(friend.id);
                req_message === null ? reply.code(201).send({ id: user.id }) : reply.code(409).send({ error: req_message });
                return;
            }
            else
                reply.code(409).send({ error: "Friend already in pending friend list" });
        }
    });
    server.route({
        method: 'DELETE',
        url: '/users/:user_id/pending_friends/:friend_id',
        config: {
            rateLimit: limit_rate_1.RateLimits.friends,
        },
        handler: async (request, reply) => {
            const { user_id, friend_id } = request.params;
            const user = await (0, user_2.getUserFromDb)(Number(user_id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const friend = await (0, user_2.getUserFromDb)(Number(friend_id));
            if (friend == null) {
                reply.code(404).send({ error: "Friend not found" });
                return;
            }
            if (user.pending_friend_list.find(f => f === friend.id)) {
                const req_message = await user.removePendingFriend(friend.id);
                req_message === null ? reply.code(204).send() : reply.code(409).send({ error: req_message });
            }
            else
                reply.code(404).send({ error: "Friend not found in pending friend list" });
        }
    });
}
