import { Match } from "./matchs";
import { db } from ".";
import { server } from ".";
import { getMatchFromDb } from "./matchs";

export const DEFAULT_AVATAR_URL : string = "https://zizi.fr";

export class User implements User {

    public username: string;
    public email: string;
    public password: string;
    public is_online: boolean;
    public created_at: Date;
    public history: Array<number>;
    public win_nbr: number;
    public loss_nbr: number; 
    public avatar: string;
    public friend_list: Array<number>;
    public id: number;

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
        this.history = new Array<number>();
        this.win_nbr = 0;
        this.loss_nbr = 0;
        this.avatar = DEFAULT_AVATAR_URL;
        this.friend_list = new Array<number>();
    }

    
    async pushUserToDb() : Promise<string | null> {
        
        if (this.id !== 0) {
            server.log.error(`User ${this.username} already exists in the DB`);
            return "User already exists";
        }
        
        try {
            const insertUser = db.prepare(`
                INSERT INTO users (username, email, password, is_online, created_at, win_nbr, loss_nbr, avatar)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
                    this.avatar
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

    async updateUserInDb() {

        if (this.id === 0) {
            server.log.error(`User ${this.username} does not exist in the DB`);
            return;
        }

        try {
            const updateUser = db.prepare(`
                UPDATE users 
                SET username = ?, email = ?, password = ?, is_online = ?, win_nbr = ?, loss_nbr = ?, avatar = ?
                WHERE id = ?
            `);

            const deleteFriends = db.prepare(`DELETE FROM friends WHERE user_id = ?`);
            const insertFriend = db.prepare(`INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`);

            db.transaction(() => {
                updateUser.run(
                    this.username,
                    this.email,
                    this.password,
                    this.is_online ? 1 : 0,
                    this.win_nbr,
                    this.loss_nbr,
                    this.avatar,
                    this.id
                );
                deleteFriends.run(this.id);
                this.friend_list.forEach(friend_id => {
                    insertFriend.run(this.id, friend_id); 
                });
            })();
            server.log.info(`User ${this.username}, ${this.id} updated in the DB`);
        } catch (error) {
            server.log.error(`Error while updating user ${this.username} in the DB: ${error}`);
        }
    }

    async deleteUserFromDb() {
        
        if (this.id === 0) {
            server.log.error(`User ${this.username} does not exist in the DB`);
            return;
        }

        try {
            const deleteUser = db.prepare(`DELETE FROM users WHERE id = ?`);


            db.transaction(() => {
                deleteUser.run(this.id);
            })();
            server.log.info(`User ${this.username}, ${this.id} deleted from the DB`);
        } catch (error) {
            server.log.error(`Error while deleting user ${this.username} from the DB: ${error}`);
        }
    }

    async addFriend(friend_id: number) {
        this.friend_list.push(friend_id);
        this.updateUserInDb();
    }

    async removeFriend(friend_id: number) {
        this.friend_list = this.friend_list.filter(f => f !== friend_id);
        this.updateUserInDb();
    }

    async addMatch(match_id: number) {
        this.history.push(match_id);
        this.updateUserInDb();
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
        } | undefined; 

        if (!userRow) return null;

        let user: User = new User(userRow.username, userRow.email, userRow.password);
        user.id = userRow.id;
        user.is_online = userRow.is_online === 1;
        user.created_at = new Date(userRow.created_at);
        user.win_nbr = userRow.win_nbr;
        user.loss_nbr = userRow.loss_nbr;
        const friends = await getFriendsFromDb(user.id);
        if (friends) user.friend_list = friends.map(f => f.id);
        
        //Retrieve user's history

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


export async function getFriendsFromDb(userId: number): Promise<User[] | null> {

    try {
        const friends = db.prepare("SELECT friend_id FROM friends WHERE user_id = ?").all(userId) as Array<{ friend_id: number }>;
        const users = new Array<User>();
        for (const friend of friends) {
            const user = await getUserFromDb(friend.friend_id);
            if (user) users.push(user);
        }
        return users;
    } catch (error) {
        server.log.error(`Could not fetch friends from DB ${error}`)
        return null;
    }
}