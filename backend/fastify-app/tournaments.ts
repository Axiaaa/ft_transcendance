import { ITournament, TournamentType  } from "./tournaments.d";
import { User } from "./user";

export class Tournament implements ITournament {

    constructor(
        public id: string,
        public name: string,
        public password: string,
        public members: User[],
        public winner: User,
        public created_at: Date,
        public duration: number,
        public type: TournamentType,
    ) {}

}