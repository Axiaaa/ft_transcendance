import type { Match } from "./matchs.d";

export interface IUser {
    id?: number;
    name: string;
    password: string;
    username: string;
    is_online: boolean;
    created_at: Date;
    history: Match[] = [];
    win_nbr: number;
    loss_nbr: number; 
    avatar: string;
    friend_list: User[] = [];
}