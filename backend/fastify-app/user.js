"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.DEFAULT_AVATAR_URL = void 0;
const _1 = require(".");
const _2 = require(".");
exports.DEFAULT_AVATAR_URL = "https://zizi.fr";
class User {
    constructor(username, email, password) {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.name = username;
        this.email = email;
        this.password = password;
        this.is_online = false;
        this.created_at = new Date();
        this.history = new Array();
        this.win_nbr = 0;
        this.loss_nbr = 0;
        this.avatar = exports.DEFAULT_AVATAR_URL;
        this.friend_list = new Array();
    }
    pushUserToDb(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _1.db.prepare('INSERT INTO users (name, email, password, is_online, created_at, history, win_nbr, loss_nbr, avatar, friend_list) VALUES (?,?,?,?,?,?,?,?,?,?)').run(user.name, user.email, user.password, user.is_online, user.created_at, JSON.stringify(user.history), user.win_nbr, user.loss_nbr, user.avatar, JSON.stringify(user.friend_list));
                _2.server.log.info(`User ${user.name}, ${user.id} inserted in the DB`);
            }
            catch (error) {
                _2.server.log.error(`Error while inserting user ${user.name} in the DB`);
            }
        });
    }
}
exports.User = User;
