"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
class Match {
    constructor(id, player1, player2, winner, created_at) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = winner;
        this.created_at = created_at;
    }
}
exports.Match = Match;
