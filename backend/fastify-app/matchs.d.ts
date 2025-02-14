export interface IMatch {
    id: string;
    player1: string,
    player2: string,
    winner: string,
    created_at: Date,
}


//Handle when a user is delete, show "Deleted User" for the opponent of every match that he did
//Delete the match if both users are deleted
//Opponent nullable and if so, print Deleted User