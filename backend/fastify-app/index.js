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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.db = void 0;
const fastify_1 = __importDefault(require("fastify"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fastify_metrics_1 = __importDefault(require("fastify-metrics"));
const user_1 = require("./user");
const Port = process.env.PORT || 4321;
exports.db = new better_sqlite3_1.default(`/usr/src/app/db/database.db`);
exports.server = (0, fastify_1.default)({
    logger: true
});
exports.server.get('/users', () => __awaiter(void 0, void 0, void 0, function* () {
    return exports.db.prepare('SELECT * FROM users').all();
}));
exports.server.post('/users/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { name } = request.body;
    const stmt = exports.db.prepare('INSERT INTO users (id, name) VALUES (?, ?)');
    stmt.run(id, name);
    reply.send({ success: true });
}));
exports.server.get('/ping', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return 'pong\n';
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.server.register(fastify_metrics_1.default, { endpoint: '/metrics' });
        yield exports.server.listen({ port: Number(Port), host: '0.0.0.0' });
        console.log('Server started sucessfully');
        let u = new user_1.User("test", "test@test.con", "test");
        yield u.pushUserToDb(u);
    }
    catch (err) {
        exports.server.log.error(err);
        process.exit(1);
    }
});
start();
