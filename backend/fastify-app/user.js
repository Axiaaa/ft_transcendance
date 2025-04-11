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
exports.User = exports.DEFAULT_BACKGROUND_URL = exports.DEFAULT_AVATAR_URL = void 0;
exports.getUserFromDb = getUserFromDb;
exports.getFriendsFromDb = getFriendsFromDb;
exports.getPendingFriendsListFromDb = getPendingFriendsListFromDb;
const _1 = require(".");
const _2 = require(".");
exports.DEFAULT_AVATAR_URL = "https://zizi.fr";
exports.DEFAULT_BACKGROUND_URL = "https://zizi.fr";
class User {
    constructor(username, email, password) {
        this.id = 0; //Id value is only a placeholder, It'll be set in the DB
        this.username = username;
        this.email = email;
        this.password = password;
        this.is_online = false;
        this.created_at = new Date();
        this.last_login = new Date();
        this.history = new Array();
        this.win_nbr = 0;
        this.loss_nbr = 0;
        this.avatar = exports.DEFAULT_AVATAR_URL;
        this.background = exports.DEFAULT_BACKGROUND_URL;
        this.friend_list = new Array();
        this.pending_friend_list = new Array();
        this.font_size = 15;
    }
    pushUserToDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id !== 0) {
                _2.server.log.error(`User ${this.username} already exists in the DB`);
                return "User already exists";
            }
            try {
                const insertUser = _1.db.prepare(`
                INSERT INTO users (username, email, password, is_online, created_at, win_nbr, loss_nbr, avatar, background, last_login, font_size)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                _1.db.transaction(() => {
                    const result = insertUser.run(this.username, this.email, this.password, this.is_online ? 1 : 0, Number(this.created_at), this.win_nbr, this.loss_nbr, this.avatar, this.background, Number(this.last_login), this.font_size);
                    const lastId = result.lastInsertRowid;
                    this.id = lastId;
                })();
                _2.server.log.info(`User ${this.username}, ${this.id} inserted in the DB`);
                return null;
            }
            catch (error) {
                if (error.message.includes("UNIQUE constraint failed: users.email")) {
                    _2.server.log.error(`The email address ${this.email} is already in the DB`);
                    return "Email address already exists!";
                }
                _2.server.log.error(`Error while inserting user ${this.username} in the DB: ${error}`);
                return "Error while inserting user in the DB";
            }
        });
    }
    updateUserInDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id === 0) {
                _2.server.log.error(`User ${this.username} does not exist in the DB`);
                return "User doesn´t exist in the database";
            }
            try {
                const updateUser = _1.db.prepare(`
                UPDATE users 
                SET username = ?, email = ?, password = ?, is_online = ?, win_nbr = ?, loss_nbr = ?, avatar = ?, background = ?, last_login = ?, font_size = ?
                WHERE id = ?
            `);
                const deleteFriends = _1.db.prepare(`DELETE FROM friends WHERE user_id = ?`);
                const insertFriend = _1.db.prepare(`INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`);
                const deletePendingFriends = _1.db.prepare(`DELETE FROM pending_friends WHERE user_id = ?`);
                const insertPendingFriend = _1.db.prepare(`INSERT INTO pending_friends (user_id, friend_id) VALUES (?, ?)`);
                _1.db.transaction(() => {
                    updateUser.run(this.username, this.email, this.password, this.is_online ? 1 : 0, this.win_nbr, this.loss_nbr, this.avatar, this.background, Number(this.last_login), this.font_size, this.id);
                    deleteFriends.run(this.id);
                    this.friend_list.forEach(friend_id => {
                        insertFriend.run(this.id, friend_id);
                    });
                    deletePendingFriends.run(this.id);
                    this.pending_friend_list.forEach(friend_id => {
                        insertPendingFriend.run(this.id, friend_id);
                    });
                })();
                _2.server.log.info(`User ${this.username}, ${this.id} updated in the DB`);
                return null;
            }
            catch (error) {
                if (error.message.includes("UNIQUE constraint failed: users.email")) {
                    _2.server.log.error(`The email address ${this.email} is already in the DB`);
                    return "Email address already exists!";
                }
                _2.server.log.error(`Error while updating user ${this.username} in the DB: ${error}`);
                return "Error while updating user in the DB";
            }
        });
    }
    deleteUserFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id === 0) {
                _2.server.log.error(`User ${this.username} does not exist in the DB`);
                return "User doesn´t exist in the database";
            }
            try {
                const deleteUser = _1.db.prepare(`DELETE FROM users WHERE id = ?`);
                _1.db.transaction(() => {
                    deleteUser.run(this.id);
                })();
                _2.server.log.info(`User ${this.username}, ${this.id} deleted from the DB`);
                return null;
            }
            catch (error) {
                _2.server.log.error(`Error while deleting user ${this.username} from the DB: ${error}`);
                return "Error while deleting user from the DB";
            }
        });
    }
    addFriend(friend_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pending_friend_list = this.pending_friend_list.filter(f => f !== friend_id);
            this.friend_list.push(friend_id);
            const req_message = this.updateUserInDb();
            return req_message;
        });
    }
    removeFriend(friend_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.friend_list = this.friend_list.filter(f => f !== friend_id);
            const req_message = this.updateUserInDb();
            return req_message;
        });
    }
    addMatch(match_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.history.push(match_id);
            const req_message = this.updateUserInDb();
            return req_message;
        });
    }
    removeMatch(match_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.history = this.history.filter(m => m !== match_id);
            const req_message = this.updateUserInDb();
            return req_message;
        });
    }
    addPendingFriend(friend_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pending_friend_list.push(friend_id);
            const req_message = this.updateUserInDb();
            return req_message;
        });
    }
    removePendingFriend(friend_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pending_friend_list = this.pending_friend_list.filter(f => f !== friend_id);
            const req_message = this.updateUserInDb();
            return req_message;
        });
    }
}
exports.User = User;
function getUserFromDb(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlRequest = "SELECT * FROM users WHERE id = ?";
            const userRow = _1.db.prepare(sqlRequest).get(query);
            if (!userRow)
                return null;
            let user = new User(userRow.username, userRow.email, userRow.password);
            user.id = userRow.id;
            user.is_online = userRow.is_online === 1;
            user.created_at = new Date(userRow.created_at);
            user.win_nbr = userRow.win_nbr;
            user.loss_nbr = userRow.loss_nbr;
            user.avatar = userRow.avatar;
            user.background = userRow.background;
            user.last_login = new Date(userRow.last_login);
            user.font_size = userRow.font_size;
            const friends = yield getFriendsFromDb(user.id);
            if (friends)
                user.friend_list = friends.map(f => f.id);
            const pending_friends = yield getPendingFriendsListFromDb(user.id);
            if (pending_friends)
                user.pending_friend_list = pending_friends.map(f => f.id);
            const userId = Number(user.id);
            const matches = _1.db.prepare("SELECT * FROM matchs").all();
            const userMatches = matches.filter(match => match.player1 === userId.toString() || match.player2 === userId.toString());
            user.history = userMatches.map(match => match.id);
            return user;
        }
        catch (error) {
            _2.server.log.error(`Could not fetch user from DB ${error}`);
            return null;
        }
    });
}
function getFriendsFromDb(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlRequest = "SELECT friend_id FROM friends WHERE user_id = ?";
            const friendsRow = _1.db.prepare(sqlRequest).all(userId);
            const users = new Array();
            for (const friend of friendsRow) {
                const user = yield getUserFromDb(friend.friend_id);
                if (user)
                    users.push(user);
            }
            return users;
        }
        catch (error) {
            _2.server.log.error(`Could not fetch friends from DB ${error}`);
            return null;
        }
    });
}
function getPendingFriendsListFromDb(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlRequest = "SELECT friend_id FROM pending_friends WHERE user_id = ?";
            const friendsRow = _1.db.prepare(sqlRequest).all(userId);
            const users = new Array();
            for (const friend of friendsRow) {
                const user = yield getUserFromDb(friend.friend_id);
                if (user)
                    users.push(user);
            }
            return users;
        }
        catch (error) {
            _2.server.log.error(`Could not fetch pending friends from DB ${error}`);
            return null;
        }
    });
}
