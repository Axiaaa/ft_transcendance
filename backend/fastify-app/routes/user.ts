import { User } from "../user";
import { db } from "..";
import { getUserFromDb  } from "../user";
import { FastifyInstance } from "fastify";

export async function userRoutes(server : FastifyInstance) {

    server.get('/users', async (request, reply) => {
        const users = db.prepare('SELECT * FROM users').all();
        const result = await Promise.all(users.map(async (tmp: any) => {
            const user = await getUserFromDb(tmp.id);
            return user !== null ? user : null;
        })).then(users => users.filter(user => user !== null));
        if (result.length === 0) {
            reply.code(404).send({ error: "No users found" });
            return;
        }
        reply.code(200).send(result);
    });


    server.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
        const { id } = request.params;
        const user = await getUserFromDb(Number(id));
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        return user;
        }
    )

    server.post<{ Body: { name: string, email: string, password: string } }>('/users', async (request, reply) => {
        const { name, email, password } = request.body;
        const user = new User(name, email, password);
        const req_message = await user.pushUserToDb();
        if (user.id != 0)
            reply.code(201).send({ id: user.id });
        else
            reply.code(409).send({ error: req_message });
    });

    server.patch<{
        Params: { id: string },
        Body : {
            username?: string, 
            email?: string, 
            password?: string, 
            is_online?: boolean, 
            avatar?: string,
            win_nbr?: number,
            loss_nbr?: number,
        }
        }>('/users/:id', async (request, reply) => {

        const { id } = request.params;
        const { username, email, password, is_online, avatar, win_nbr, loss_nbr } = request.body;
        let user = await getUserFromDb(Number(id));
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        if (username)   { user.username = username }
        if (email)      { user.email = email }
        if (password)   { user.password = password; }
        if (is_online)  { user.is_online = is_online; }
        if (avatar)     { user.avatar = avatar; }
        if (win_nbr)    { user.win_nbr = win_nbr; }
        if (loss_nbr)   { user.loss_nbr = loss_nbr; }
        await user.updateUserInDb();
        reply.code(204).send();
    });


    server.delete<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
        const { id } = request.params;
        const user = await getUserFromDb(Number(id));
    
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }   
        await user.deleteUserFromDb();
        reply.code(204).send();
        }
    );
            
    server.get<{ Params: { id: string } }>('/users/:id/friends', async (request, reply) => {
        const { id } = request.params;
        const user = await getUserFromDb(Number(id));
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
    );

    server.post<{ Params: { id: string } , Body: { friend_id: number } }>('/users/:id/friends', async (request, reply) => {
        const { id } = request.params;
        const { friend_id } = request.body;
        const user = await getUserFromDb(Number(id));
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const friend = await getUserFromDb(friend_id);
        if (friend == null) {
            reply.code(404).send({error: "Friend not found"});
            return;
        }
        if (friend.id === user.id) {
            reply.code(409).send({error: "Can't add yourself as a friend"});
            return;
        }   
        if (user.friend_list.find(f => f === friend.id) == undefined) {
            user.addFriend(friend.id);
            reply.code(201).send();
            return;
        } else  
            reply.code(409).send({error: "Friend already in friend list"});
        }
    );

    server.delete<{ Params: { user_id: string, friend_id: string } }>('/users/:user_id/friends/:friend_id', async (request, reply) => {
        const { user_id, friend_id } = request.params;
        const user = await getUserFromDb(Number(user_id));
        if (user == null) {
            reply.code(404).send({error: "User not found"});
            return;
        }
        const friend = await getUserFromDb(Number(friend_id));
        if (friend == null) {
            reply.code(404).send({error: "Friend not found"});
            return;
        }
        if (user.friend_list.find(f => f === friend.id)) {
            user.removeFriend(friend.id);
            reply.code(204).send();
        } else
            reply.code(404).send({error: "Friend not found in friend list"});
        }
    );
}