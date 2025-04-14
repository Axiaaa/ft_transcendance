import { Match } from "./matchs";
import { db } from ".";
import { server } from ".";
import { getMatchFromDb } from "./matchs";
import path from "path";

export const DEFAULT_AVATAR_URL : string = "https://zizi.fr";
export const DEFAULT_BACKGROUND_URL : string = "https://zizi.fr";

export class User implements User {

    public id: number;
    public username: string;
    public email: string;
    public password: string;
    public is_online: boolean;
    public created_at: Date;
    public last_login: Date;
    public history: Array<number>;
    public win_nbr: number;
    public loss_nbr: number; 
    public avatar: string;
    public background: string;
    public friend_list: Array<number>;
    public pending_friend_list: Array<number>;
    public font_size: number;

    constructor(
        username: string,
        email: string,
        password: string,
    )
    {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.username = username;
        this.email = email;
        this.password = password;
        this.is_online = false;
        this.created_at = new Date();
        this.last_login = new Date();
        this.history = new Array<number>();
        this.win_nbr = 0;
        this.loss_nbr = 0;
        this.avatar = DEFAULT_AVATAR_URL;
        this.background = DEFAULT_BACKGROUND_URL;
        this.friend_list = new Array<number>();
        this.pending_friend_list = new Array<number>();
        this.font_size = 15;
    }

    
    async pushUserToDb() : Promise<string | null> {
        
        if (this.id !== 0) {
            server.log.error(`User ${this.username} already exists in the DB`);
            return "User already exists";
        }
        
        try {
            const insertUser = db.prepare(`
                INSERT INTO users (username, email, password, is_online, created_at, win_nbr, loss_nbr, avatar, background, last_login, font_size)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                
                    db.transaction(() => {
                        
                        const result = insertUser.run(
                            this.username,  
                            this.email,
                            this.password,
                            this.is_online ? 1 : 0,
                            Number(this.created_at),
                            this.win_nbr,
                            this.loss_nbr,
                            this.avatar,
                            this.background,
                            Number(this.last_login),
                            this.font_size
                            
                );
                const lastId = result.lastInsertRowid as number;
                this.id = lastId;
                
            })();
            server.log.info(`User ${this.username}, ${this.id} inserted in the DB`);
            return null;
        } catch (error) {
            if ((error as any).message.includes("UNIQUE constraint failed: users.email")) {
                server.log.error(`The email address ${this.email} is already in the DB`);
                return "Email address already exists!";
            }
            server.log.error(`Error while inserting user ${this.username} in the DB: ${error}`);
            return "Error while inserting user in the DB";
        }
    }

    async updateUserInDb() : Promise<string | null> {

        if (this.id === 0) {
            server.log.error(`User ${this.username} does not exist in the DB`);
            return "User doesn´t exist in the database";
        }

        try {
            const updateUser = db.prepare(`
                UPDATE users 
                SET username = ?, email = ?, password = ?, is_online = ?, win_nbr = ?, loss_nbr = ?, avatar = ?, background = ?, last_login = ?, font_size = ?
                WHERE id = ?
            `);

            const deleteFriends = db.prepare(`DELETE FROM friends WHERE user_id = ?`);
            const insertFriend = db.prepare(`INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`);

            const deletePendingFriends = db.prepare(`DELETE FROM pending_friends WHERE user_id = ?`);
            const insertPendingFriend = db.prepare(`INSERT INTO pending_friends (user_id, friend_id) VALUES (?, ?)`);

            db.transaction(() => {
                updateUser.run(
                    this.username,
                    this.email,
                    this.password,
                    this.is_online ? 1 : 0,
                    this.win_nbr,
                    this.loss_nbr,
                    this.avatar,
                    this.background,
                    Number(this.last_login),
                    this.font_size,
                    this.id,
                );
                deleteFriends.run(this.id);
                this.friend_list.forEach(friend_id => {
                    insertFriend.run(this.id, friend_id); 
                });
                deletePendingFriends.run(this.id);
                this.pending_friend_list.forEach(friend_id => {
                    insertPendingFriend.run(this.id, friend_id); 
                });
            })();
            server.log.info(`User ${this.username}, ${this.id} updated in the DB`);
            return null;
        } catch (error) {
            if ((error as any).message.includes("UNIQUE constraint failed: users.email")) {
                server.log.error(`The email address ${this.email} is already in the DB`);
                return "Email address already exists!";
            }
            server.log.error(`Error while updating user ${this.username} in the DB: ${error}`);
            return "Error while updating user in the DB";
        }
    }

    async deleteUserFromDb() : Promise<string | null>{
        
        if (this.id === 0) {
            server.log.error(`User ${this.username} does not exist in the DB`);
            return "User doesn´t exist in the database";
        }

        try {
            const deleteUser = db.prepare(`DELETE FROM users WHERE id = ?`);

            db.transaction(() => {
                deleteUser.run(this.id);
            })();
            server.log.info(`User ${this.username}, ${this.id} deleted from the DB`);
            return null;
        } catch (error) {
            server.log.error(`Error while deleting user ${this.username} from the DB: ${error}`);
            return "Error while deleting user from the DB";
        }
    }

    async addFriend(friend_id: number) : Promise<string | null> {
        this.pending_friend_list = this.pending_friend_list.filter(f => f !== friend_id);
        this.friend_list.push(friend_id);
        const req_message = this.updateUserInDb();
        return req_message;
    }

    async removeFriend(friend_id: number) : Promise<string | null> {
        this.friend_list = this.friend_list.filter(f => f !== friend_id);
        const req_message = this.updateUserInDb();
        return req_message;
    }

    async addMatch(match_id: number) : Promise<string | null> {
        this.history.push(match_id);
        const req_message = this.updateUserInDb();
        return req_message;
    }

    async removeMatch(match_id: number) : Promise<string | null> {
        this.history = this.history.filter(m => m !== match_id);
        const req_message = this.updateUserInDb();
        return req_message;
    }

    async addPendingFriend(friend_id: number) : Promise<string | null> {
        this.pending_friend_list.push(friend_id);
        const req_message = this.updateUserInDb();
        return req_message;
    }

    async removePendingFriend(friend_id: number) : Promise<string | null> {
        this.pending_friend_list = this.pending_friend_list.filter(f => f !== friend_id);
        const req_message = this.updateUserInDb();
        return req_message;
    }
}

export async function getUserFromDb(query: number): Promise<User | null> {

    try { 
        const sqlRequest = "SELECT * FROM users WHERE id = ?";
        const userRow = db.prepare(sqlRequest).get(query) as { 
            id: number;
            username: string;
            email: string;
            password: string;
            is_online: number;
            created_at: string;
            win_nbr: number;
            loss_nbr: number;
            avatar: string;
            background: string;
            last_login: string;
            font_size: number;
        } | undefined; 

        if (!userRow) return null;

        let user: User = new User(userRow.username, userRow.email, userRow.password);
        user.id = userRow.id;
        user.is_online = userRow.is_online === 1;
        user.created_at = new Date(userRow.created_at);
        user.win_nbr = userRow.win_nbr;
        user.loss_nbr = userRow.loss_nbr;
        user.avatar = userRow.avatar;
        user.background = userRow.background;
        user.last_login = new Date(userRow.last_login);
        user.font_size = userRow.font_size;
        const friends = await getFriendsFromDb(user.id);
        if (friends) user.friend_list = friends.map(f => f.id);
        const pending_friends = await getPendingFriendsListFromDb(user.id)
        if (pending_friends) user.pending_friend_list = pending_friends.map(f => f.id); 
        
        const userId = Number(user.id);
        const matches = db.prepare("SELECT * FROM matchs").all() as Array<Match>;
        const userMatches = matches.filter(match => match.player1 === userId.toString() || match.player2 === userId.toString());
        user.history = userMatches.map(match => match.id);
        return user;

    } catch (error) {
        server.log.error(`Could not fetch user from DB ${error}`)
        return null;
    }
}

export async function getFriendsFromDb(userId: number): Promise<Array<User> | null> {

    try {
        const sqlRequest = "SELECT friend_id FROM friends WHERE user_id = ?";
        const friendsRow = db.prepare(sqlRequest).all(userId) as Array<{ friend_id: number }>;
        const users = new Array<User>();
        for (const friend of friendsRow) {
            const user = await getUserFromDb(friend.friend_id);
            if (user) users.push(user);
        }
        return users;
    } catch (error) {
        server.log.error(`Could not fetch friends from DB ${error}`)
        return null;
    }
}

export async function getPendingFriendsListFromDb(userId: number): Promise<Array<User> | null> {

    try {
        const sqlRequest = "SELECT friend_id FROM pending_friends WHERE user_id = ?";
        const friendsRow = db.prepare(sqlRequest).all(userId) as Array<{ friend_id: number }>;
        const users = new Array<User>();
        for (const friend of friendsRow) {
            const user = await getUserFromDb(friend.friend_id);
            if (user) users.push(user);
        }
        return users;
    } catch (error) {
        server.log.error(`Could not fetch pending friends from DB ${error}`)
        return null;
    }
}

export  async function updateUserAvatar(user: User, filePath: string) : Promise<string | null> {
    const userFromDb = await getUserFromDb(user.id);
    if (userFromDb == null) {
        return "User not found";
    }
    userFromDb.avatar = filePath;
    const req_message = await userFromDb.updateUserInDb();
    return req_message;
}

export async function updateUserBackground(user: User, filePath: string) : Promise<string | null> {
    const userFromDb = await getUserFromDb(user.id);
    if (userFromDb == null) {
        return "User not found";
    }
    userFromDb.background = filePath;
    const req_message = await userFromDb.updateUserInDb();
    return req_message;
}
