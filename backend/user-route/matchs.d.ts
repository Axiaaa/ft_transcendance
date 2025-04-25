export interface IMatch {
    id: number;
    player1: string,
    player2: string,
    winner: string | null,
    score: string,
    created_at: Date,
}
