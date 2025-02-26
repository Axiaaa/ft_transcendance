export interface IMatch {
    id: number;
    player1: string,
    player2: string,
    winner: number | null,
    score: string,
    is_tournament: boolean,
    created_at: Date,
}
