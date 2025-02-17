export interface ITournament {
    id: string;
    name: string;
    password: string;
    members: Array<User>;
    winner: User;
    created_at: Date;
    duration: number;
    type: TournamentType;
}

export enum TournamentType {
    FFA,
    BRACKET,
}