export interface ITournament {
    id: number;
    name: string;
    password: string | null;
    members: Array<Number>;
    matches : Array<Number>;
    creator: User;
    winner: User | null;
    created_at: Date;
    duration? : number;
    type: TournamentType;
}

export enum TournamentType {
    FFA = 1,
    BRACKET = 2, 
}