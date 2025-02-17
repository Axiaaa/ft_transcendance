"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tournament = void 0;
class Tournament {
    constructor(id, name, password, members, winner, created_at, duration, type) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.members = members;
        this.winner = winner;
        this.created_at = created_at;
        this.duration = duration;
        this.type = type;
    }
}
exports.Tournament = Tournament;
