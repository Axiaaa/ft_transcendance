export interface ITournament {
    id: string;
    name: string;
    password: string;
    members: User[];
    winner: User;
    created_at: Date;
    duration: number;
    type: TournamentType;
}

export enum TournamentType {
    FFA,
    BRACKET,
}