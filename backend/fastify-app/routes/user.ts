import { getUserFromHash, User } from "../user";
import { db, salt } from "..";
import { getUserFromDb  } from "../user";
import { FastifyInstance, FastifyContextConfig } from "fastify";
import { RateLimits } from '../limit_rate';
import crypto from "crypto";
import { sha256 } from "js-sha256";


declare module "fastify" {
  interface FastifyContextConfig {
    rateLimit?: unknown;
  }
}

/**
 * Sets up user-related routes for the Fastify instance.
 * 
 * @param server - The Fastify instance to register routes with
 * 
 * @remarks
 * This function sets up the following routes:
 * 
 * - `GET /users`: Retrieve all users in the system
 * - `GET /users/:token`: Get a specific user by their token
 * - `GET /users/login`: Authenticate a user with username and password (query parameters)
 * - `POST /users/login`: Create a new user
 * - `PATCH /users/:token`: Update a user's information
 * - `DELETE /users/:token`: Delete a user
 * - `GET /users/:token/friends`: Get a user's friends
 * - `POST /users/:token/friends`: Add a friend to a user
 * - `DELETE /users/:token/friends/:friend_username`: Remove a friend from a user's friend list
 * - `GET /users/:token/pending_friends`: Get a user's pending friend requests
 * - `POST /users/:token/pending_friends`: Add a pending friend request
 * - `DELETE /users/:token/pending_friends/:friend_username`: Remove a pending friend request
 * 
 * All routes include appropriate rate limiting and error handling.
 * 
 * @returns A Promise that resolves when all routes have been registered
 */
export async function userRoutes(server : FastifyInstance) {

    server.route({
        method: 'GET',
        url: '/users',
        config: {
            rateLimit: RateLimits.login,
        },
        handler: async (request, reply) => {
            const users = db.prepare('SELECT * FROM users').all();
            const result = await Promise.all(users.map(async (tmp: any) => {
                const user = await getUserFromDb( { id: tmp.id });
                return user !== null ? user : null;
            })).then(users => users.filter(user => user !== null));
            
            if (result.length === 0) {
                reply.code(404).send({ error: "No users found" });
                return;
            }
            reply.code(200).send(result);
        }
    });

    server.route<{
        Params: { token: string}
      }>({
        method: 'GET',
        url: '/users/:token',
        config: {
          rateLimit: RateLimits.login,
        },
        handler: async (request, reply) => {
          const { token } = request.params;
          const user = await getUserFromDb({ token });
          if (user == null) {
              reply.code(404).send({ error: "User not found" });
              return;
            }
            
          reply.code(200).send(user);
        }
      });

    server.route<{
        Querystring: { username: string, password: string }
        }>({
        method: 'GET',
        url: '/users/login',
        config: {
            rateLimit: RateLimits.login,
        },
        handler: async (request, reply) => {
            const { username, password } = request.query;
            if (!username || !password) {
                reply.code(400).send({error: "Username and password are required"});
                return;
            }
            const user = await getUserFromHash(username, password);
            if (user == null) {
                reply.code(404).send({error: "User not found"});
                return;
            }
            user.token = crypto.randomBytes(32).toString('hex');
            user.updateUserInDb();
            reply.code(200).send(user);
            }
        }
    );

    server.route<{
        Body: {
            username: string,
            password: string
        }
        }>({
        method: 'POST',
        url: '/users/login',
        config: {
            rateLimit: RateLimits.login,
        },
            handler: async (request, reply) => {
            const { username, password } = request.body;
            if (!username || !password) {
                reply.code(400).send({error: "Username and password are required"});
                return;
            }
            const existingUser = await getUserFromHash(username, password);
            if (existingUser) {
                reply.code(409).send({error: "Username already exists"});
                return;
            }
            const user = new User(username, password);
            user.pushUserToDb();
            reply.code(201).send({ id: user.id, token : user.token });
            }
        }
    );

    server.route<{
        Params: { token: string },
        Body: {
            username?: string,
            email?: string,
            password?: string,
            is_online?: boolean,
            avatar?: string,
            win_nbr?: number,
            loss_nbr?: number,
            background?: string,
            last_login?: number,
            font_size?: number
        }
    }>({
        method: 'PATCH',
        url: '/users/:token',
        config: {
            rateLimit: RateLimits.patch_user,
        },
        handler: async (request, reply) => {

        const { token } = request.params;
        const { username, email, password, is_online, avatar, win_nbr, loss_nbr, background, last_login, font_size } = request.body;
        

        let user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (username)   { user.username = username }
        if (email)      { user.email = email }
        if (password)   { user.password = sha256.hmac(salt, password); }
        if (is_online)  { user.is_online = is_online; }
        if (avatar)     { user.avatar = avatar; }
        if (win_nbr)    { user.win_nbr = win_nbr; }
        if (loss_nbr)   { user.loss_nbr = loss_nbr; }
        if (background) { user.background = background; }
        if (last_login) { user.last_login = new Date(last_login); }
        if (font_size)  { 
            user.font_size = Math.max(10, Math.min(font_size, 20));
        }
        
            const req_message = await user.updateUserInDb();
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error : req_message });
        }
    });


    server.route<{
        Params: { token: string}
      }>({
        method: 'DELETE',
        url: '/users/:token',
        config: {
          rateLimit: RateLimits.delete_user,
        },
        handler: async (request, reply) => {
          const { token } = request.params;
          const user = await getUserFromDb({ token });
      
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
            
    server.route <{ Params: { token: string} }>(
    {
        method : 'GET',
        url : '/users/:token/friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
    
        const { token } = request.params;
        const user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (user.friend_list.length === 0) {
            reply.code(404).send({error: "Empty friend list"});
            return;
        }
        return user.friend_list;
        }
    });

    server.route <{ Params: { token: string} , Body: { friend_username: string } }>({
        method : 'POST',
        url : '/users/:token/friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
        const { token } = request.params;
        const { friend_username } = request.body;
        const user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const friend = await getUserFromDb({username : friend_username});
        if (friend == null) {
            reply.code(404).send({error: "Friend not found"});
            return;
        }
        if (friend.id === user.id) {
            reply.code(409).send({error: "Can't add yourself as a friend"});
            return;
        }   
        if (user.friend_list.find(f => f === friend.id) == undefined) {
            const req_message = await user.addFriend(friend.id);
            req_message === null ? reply.code(201).send({ id : user.id}) : reply.code(409).send({ error : req_message });
            return;
        } else  
            reply.code(409).send({error: "Friend already in friend list"});
        }
});

    server.route <{ Params: { token: string, friend_username: string } }>({
        method : 'DELETE',
        url : '/users/:token/friends/:friend_username',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
        const { token, friend_username } = request.params;
        const user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const friend = await getUserFromDb({username: friend_username});
        if (friend == null) {
            reply.code(404).send({error: "Friend not found"});
            return;
        }
        if (user.friend_list.find(f => f === friend.id)) {
            const req_message = await user.removeFriend(friend.id);
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error : req_message });            
        } else
            reply.code(404).send({error: "Friend not found in friend list"});
        }
});

    server.route <{ Params: { token: string} }>({
        method : 'GET',
        url : '/users/:token/pending_friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
         const { token } = request.params;
        const user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (user.pending_friend_list.length === 0) {
            reply.code(404).send({error: "Empty pending friend list"});
            return;
        }
        return user.pending_friend_list;
        }
});

    server.route <{ Params: { token: string} , Body: { friend_username : string } }>({
        method : 'POST',
        url : '/users/:token/pending_friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
        const { token } = request.params;
        const { friend_username } = request.body;
        const user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const friend = await getUserFromDb({username : friend_username});
        if (friend == null) {
            reply.code(404).send({error: "Friend not found"});
            return;
        }
        if (friend.id === user.id) {
            reply.code(409).send({error: "Can't add yourself as a pending friend"});
            return;
        }
        if (user.friend_list.includes(friend.id)) {
            reply.code(409).send({error: "Friend already in friend list"});
            return;
        }
        if (user.pending_friend_list.find(f => f === friend.id) == undefined) {
            const req_message = await friend.addPendingFriend(user.id);
            req_message === null ? reply.code(201).send({ id : user.id}) : reply.code(409).send({ error : req_message });
            return;
        } else  
            reply.code(409).send({error: "Friend already in pending friend list"});
        }
});

    server.route <{ Params: { token: string, friend_username: string } }>({
        method : 'DELETE',
        url : '/users/:token/pending_friends/:friend_username',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
        const { token, friend_username } = request.params;
        const user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const friend = await getUserFromDb({ username: friend_username });
        if (friend == null) {
            reply.code(404).send({error: "Friend not found"});
            return;
        }
        if (user.pending_friend_list.find(f => f === friend.id)) {
            const req_message = await user.removePendingFriend(friend.id);
            req_message === null ? reply.code(204).send() : reply.code(409).send({ error : req_message });            
        } else
            reply.code(404).send({error: "Friend not found in pending friend list"});
        }
});

}