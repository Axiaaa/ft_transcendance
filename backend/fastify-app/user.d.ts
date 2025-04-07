import type { Match } from "./matchs";
import {User} from "./user";

export interface IUser {
    id?: number;
    email: string;
    password: string;
    username: string;
    is_online: boolean;
    created_at: Date;
    history: Array<number>;
    win_nbr: number;
    loss_nbr: number; 
    avatar: string;
    friend_list: Array<number>;
}