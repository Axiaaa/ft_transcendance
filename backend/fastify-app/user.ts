import { publicDecrypt } from "crypto";
import { Match } from "./matchs";
import { db } from ".";
import { server } from ".";

export const DEFAULT_AVATAR_URL : string = "https://zizi.fr";

export class User implements User {

    public name: string;
    public email: string;
    public password: string;
    public is_online: boolean;
    public created_at: Date;
    public history: Match[];
    public win_nbr: number;
    public loss_nbr: number; 
    public avatar: string;
    public friend_list: User[];
    public id: number;

    constructor(
        username: string,
        email: string,
        password: string,
    )
    {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.name = username;
        this.email = email;
        this.password = password;
        this.is_online = false;
        this.created_at = new Date();
        this.history = new Array<Match>();
        this.win_nbr = 0;
        this.loss_nbr = 0;
        this.avatar = DEFAULT_AVATAR_URL;
        this.friend_list = new Array<User>();
    }

    async pushUserToDb() : Promise<string | null> {
        //TODO : Check if the email is already in the DB

        if (this.id !== 0) {
            server.log.error(`User ${this.name} already exists in the DB`);
            return "User already exists";
        }
        try {
            const insertUser = db.prepare(`
                INSERT INTO users (username, email, password, is_online, created_at, win_nbr, loss_nbr, avatar)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
    
            const insertFriend = db.prepare(`
                INSERT INTO friends (user_id, friend_id)
                VALUES (?, ?)
            `);
    
            db.transaction(() => {

                const result = insertUser.run(
                    this.name,  
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
                
                if (this.friend_list && this.friend_list.length > 0) {
                    for (const friendId of this.friend_list) {
                        insertFriend.run(lastId, friendId);
                    }
                }
            })();
            server.log.info(`User ${this.name}, ${this.id} inserted in the DB`);
            return null;

        } catch (error) {
            if ((error as any).message.includes("UNIQUE constraint failed: users.email")) {
                server.log.error(`The email address ${this.email} is already in the DB`);
                return "Email address already exists!";
            }
            server.log.error(`Error while inserting user ${this.name} in the DB: ${error}`);
            return "Error while inserting user in the DB";
        }
    }
}


export async function getUserFromDb(query: number): Promise<User | null> {

    try { 
        const sqlrequest = "SELECT * FROM users WHERE id = ?";
        const user = db.prepare(sqlrequest).get(query) as User | undefined;
        if (user != undefined)
            return user;
        return null;
    } catch (error) {
        server.log.error(`Could not fetch uer from DB ${error}`)
        return null;
    }
}