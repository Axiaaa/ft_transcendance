import { IUser } from "./user.d"
import { Match } from "./matchs.d"

export class User implements User {

    constructor(
        public id: string,
        public name: string,
        public password: string,
        public username: string,
        public is_online: boolean,
        public created_at: Date,
        public history: Match[],
        public win_nbr: number,
        public loss_nbr: number, 
        public avatar: string,
        public friend_list: User[],
    )
    {
        //Constructor logic
        // Ex : generate creation date, default username, etc..
    }


}