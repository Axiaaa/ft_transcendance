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
 * - `GET /users/:uid`: Get a specific user by their token
 * - `GET /users/login`: Authenticate a user with username and password (query parameters)
 * - `POST /users/login`: Create a new user
 * - `PATCH /users/:uid`: Update a user's information
 * - `DELETE /users/:uid`: Delete a user
 * - `GET /users/:uid/friends`: Get a user's friends
 * - `POST /users/:uid/friends`: Add a friend to a user
 * - `DELETE /users/:uid/friends/:friend_username`: Remove a friend from a user's friend list
 * - `GET /users/:uid/pending_friends`: Get a user's pending friend requests
 * - `POST /users/:uid/pending_friends`: Add a pending friend request
 * - `DELETE /users/:uid/pending_friends/:friend_username`: Remove a pending friend request
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
                const user = await getUserFromDb({ id: tmp.id });
                if (user !== null) {
                    return {
                        username: user.username,
                        avatar: user.avatar,
                        is_online : user.is_online,
                        id : user.id,
                        history : user.history
                    };
                }
                return null;
            })).then(users => users.filter(user => user !== null));
            
            if (result.length === 0) {
                reply.code(204).send({ error: "No users found" });
                return;
            }
            reply.code(200).send(result);
        }
    });

    server.route<{
        Params: { uid: string}
      }>({
        method: 'GET',
        url: '/users/:uid',
        config: {
          rateLimit: RateLimits.login,
        },
        handler: async (request, reply) => {
          const { uid } = request.params;
          const user = await getUserFromDb({ id : Number(uid) });
          if (user == null) {
              reply.code(404).send({ error: "User not found" });
              return;
            }
              const { password, token, ...userWithoutSensitiveData } = user;
              reply.code(200).send(userWithoutSensitiveData);
        }
      });

    server.route<{
        Body: {
            username: string,
            password: string,
            signup: boolean
        }
        }>({
        method: 'POST',
        url: '/users/login',
        config: {
            rateLimit: RateLimits.login,
        },
        handler: async (request, reply) => {
            const { username, password, signup } = request.body;
            if (!username || !password) {
                reply.code(400).send({error: "Username and password are required"});
                return;
            }
            if (/[^A-Za-z0-9]/.test(username) && username.length <= 20){
                    reply.code(400).send({error: "Username can only contain alphanumeric characters"});
                    return ;
                }
            if (password && (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password))) {
                reply.code(400).send({error: "Password must contain at least one uppercase letter, one lowercase letter, and one number"});
                return ;
            }   
            if (signup)
            {
                const existingUsername = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
                if (existingUsername) {
                    reply.code(409).send({error: "Username already exists"});
                    return;
                }
                const existingUser = await getUserFromHash(username, password);
                if (existingUser) {
                    reply.code(409).send({error: "Username already exists"});
                    return;
                }
                const user = new User(username, password);
                user.is_online = true;
                user.pushUserToDb();
                reply.code(201).send({ id: user.id, token : user.token });
            }
            else
            {
                const user = await getUserFromHash(username, password);
                if (user == null) {
                    reply.code(400).send({error: "User not found"});
                    return;
                }
                user.token = crypto.randomBytes(32).toString('hex');
                user.updateUserInDb();
                reply.code(200).send({ id: user.id, token : user.token });
            }
        }
    }
    );

    server.route<{
        Params: { uid: string },
        Body: {
            username?: string,
            password?: string,
            is_online?: boolean,
            font_size?: number
        }
    }>({
        method: 'PATCH',
        url: '/users/:uid',
        config: {
            rateLimit: RateLimits.patch_user,
        },
        handler: async (request, reply) => {

        const { uid } = request.params;
        const { username, password, is_online, font_size } = request.body;
        if (username && /[^A-Za-z0-9]/.test(username) && username.length <= 20) {
            reply.code(400).send({error: "Username can only contain alphanumeric characters"});
            return ;
        }
        if (password && (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password))) {
            reply.code(400).send({error: "Password must contain at least one uppercase letter, one lowercase letter, and one number"});
            return ;
        }        

        let user = await getUserFromDb({ id : Number(uid) });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (username)   { user.username = username }
        if (password)   { user.password = sha256.hmac(salt, password); }
        if (is_online)  { user.is_online = Boolean(is_online) }
        if (font_size)  { 
            user.font_size = Math.max(10, Math.min(font_size, 20));
        }
        
        const req_message = await user.updateUserInDb();
        req_message === null ? reply.code(204).send() : reply.code(409).send({ error : req_message });
    }
    });


    server.route<{
        Params: { uid: string}
      }>({
        method: 'DELETE',
        url: '/users/:uid',
        config: {
          rateLimit: RateLimits.delete_user,
        },
        handler: async (request, reply) => {
          const { uid } = request.params;
          const user = await getUserFromDb({ id : Number(uid) });
      
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
            
    server.route <{ Params: { uid: string} }>(
    {
        method : 'GET',
        url : '/users/:uid/friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
    
        const { uid } = request.params;
        const user = await getUserFromDb({ id : Number(uid) });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (user.friend_list.length === 0) {
            reply.code(204).send({error: "Empty friend list"});
            return;
        }
        return reply.code(200).send(user.friend_list);
        }
    });

    server.route <{ Params: { uid: string} , Body: { friend_username: string } }>({
        method : 'POST',
        url : '/users/:uid/friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
        const { uid } = request.params;
        const { friend_username } = request.body;
        const user = await getUserFromDb({ id : Number(uid) });
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
            // Add friend to user's friend list
            const req_message = await user.addFriend(friend.id);
            if (req_message !== null) {
                reply.code(409).send({ error: req_message });
                return;
            }
            
            // Add user to friend's friend list
            const friend_req_message = await friend.addFriend(user.id);
            if (friend_req_message !== null) {
                // Rollback if adding user to friend's list fails
                await user.removeFriend(friend.id);
                reply.code(409).send({ error: friend_req_message });
                return;
            }
            
            // Verify both database updates were successful
            const updated_user = await getUserFromDb({ id : Number(uid) });
            const updated_friend = await getUserFromDb({ username: friend_username });
            
            if (!updated_user?.friend_list.includes(friend.id) || 
                !updated_friend?.friend_list.includes(user.id)) {
                // Something went wrong, rollback changes
                await user.removeFriend(friend.id);
                await friend.removeFriend(user.id);
                reply.code(409).send({ error: "Failed to update both users' friend lists" });
                return;
            }
            
            reply.code(201).send({ id: user.id });
            return;
        } else  
            reply.code(409).send({error: "Friend already in friend list"});
        }
});

    server.route <{ Params: { uid: string, friend_username: string } }>({
        method : 'DELETE',
        url : '/users/:uid/friends/:friend_username',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
            const { uid, friend_username } = request.params;
            const user = await getUserFromDb({ id : Number(uid) });
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
                if (req_message !== null) {
                    reply.code(409).send({ error: req_message });
                    return;
                }
                const friend_req_message = await friend.removeFriend(user.id);
                if (friend_req_message !== null) {
                    await user.addFriend(friend.id);
                    reply.code(409).send({ error: friend_req_message });
                    return;
                }
                const updated_user = await getUserFromDb({ id : Number(uid) });
                const updated_friend = await getUserFromDb({ username: friend_username });
                if (updated_user?.friend_list.includes(friend.id) ||
                    updated_friend?.friend_list.includes(user.id)) {
                    await user.addFriend(friend.id);
                    await friend.addFriend(user.id);
                    reply.code(409).send({ error: "Failed to update both users' friend lists" });
                    return;
                }
                reply.code(204).send();
            } else
                reply.code(404).send({error: "Friend not found in friend list"});
        }
});

    server.route <{ Params: { uid: string} }>({
        method : 'GET',
        url : '/users/:uid/pending_friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
         const { uid } = request.params;
        const user = await getUserFromDb({ id : Number(uid) });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (user.pending_friend_list.length === 0) {
            reply.code(204).send({error: "Empty pending friend list"});
            return;
        }
            return user.pending_friend_list;
        }
});

    server.route <{ Params: { uid: string} , Body: { friend_username : string } }>({
        method : 'POST',
        url : '/users/:uid/pending_friends',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
        const { uid } = request.params;
        const { friend_username } = request.body;
        const user = await getUserFromDb({ id : Number(uid) });
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

    server.route <{ Params: { uid: string, friend_username: string } }>({
        method : 'DELETE',
        url : '/users/:uid/pending_friends/:friend_username',
        config: {
            rateLimit: RateLimits.friends,
        },
        handler : async (request, reply) => {
        const { uid, friend_username } = request.params;
        const user = await getUserFromDb({ id : Number(uid) });
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

server.route<{ 
    Body: {
        username: string,
        password: string,
        token: string
    }
    }>({
    method: 'POST',
    url: '/users/login_ranked',
    config: {
        rateLimit: RateLimits.login,
    },
        handler: async (request, reply) => {
        const { username, password, token } = request.body;
        const user = await getUserFromDb({ token });
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (user.username == username) {
            reply.code(400).send({error: "Username can only contain alphanumeric characters"});
            return ;
        }
        const user2 = await getUserFromHash(username, password);
        if (user2 == null) {
            reply.code(400).send({error: "User not found"});
            return;
        }
        user2.token = crypto.randomBytes(32).toString('hex');
        user2.updateUserInDb();
        reply.code(200).send(user2);
    }
}
);

}