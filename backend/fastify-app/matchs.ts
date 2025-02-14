import { IMatch } from "./matchs.d";

export class Match implements IMatch {

    constructor(
        public id: string,
        public player1: string,
        public player2: string,
        public winner: string,
        public created_at: Date,
    ) {}

}