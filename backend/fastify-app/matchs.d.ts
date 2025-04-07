export interface IMatch {
    id: number;
    player1: string,
    player2: string,
    winner: string | null,
    score: string,
    is_tournament: boolean,
    tournament_id: number | null,
    created_at: Date,
}
