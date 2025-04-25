
export interface IUser {
    id?: number;
    email: string;  
    password: string;
    username: string;
    is_online: boolean;
    created_at: Date;
    last_login: Date;
    history: Array<number>;
    win_nbr: number;
    loss_nbr: number; 
    avatar: string;
    background: string;
    friend_list: Array<number>;
    pending_friend_list: Array<number>;
    font_size: number;
    token: string;
}