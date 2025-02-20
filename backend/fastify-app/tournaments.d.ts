export interface ITournament {
    id: number;
    name: string;
    password: string?;
    members: Array<User>;
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