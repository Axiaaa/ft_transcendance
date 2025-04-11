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
const user_1 = require("./routes/user");
const tournaments_1 = require("./routes/tournaments");
const matchs_1 = require("./routes/matchs");
const keep_alive_1 = require("./routes/keep_alive");
const Port = process.env.PORT || 4321;
const envUser = process.env.API_USERNAME || 'admin';
const envPassword = process.env.API_PASSWORD || 'admin';
exports.db = new better_sqlite3_1.default(`/usr/src/app/db/database.db`);
exports.server = (0, fastify_1.default)({
    logger: true
});
exports.server.addHook('preHandler', (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    if (username !== envUser || password !== envPassword) {
        return reply.code(401).send({ error: 'Unauthorized. Please provid valid credentials' });
    }
    if (req.method === 'POST' || req.method === 'PATCH') {
        try {
            JSON.parse(JSON.stringify(req.body));
        }
        catch (error) {
            return reply.code(400).send({ error: 'Invalid JSON body' });
        }
    }
}));
exports.server.get('/ping', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return 'pong\n';
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.server.register(fastify_metrics_1.default, { endpoint: '/metrics' });
        yield exports.server.register(tournaments_1.tournamentRoutes, { prefix: '/api' });
        yield exports.server.register(user_1.userRoutes, { prefix: '/api' });
        yield exports.server.register(matchs_1.matchsRoutes, { prefix: '/api' });
        yield exports.server.register(keep_alive_1.keepAliveRoute, { prefix: '/api' });
        yield exports.server.listen({ port: Number(Port), host: '0.0.0.0' });
        console.log('Server started sucessfully');
    }
    catch (err) {
        exports.server.log.error(err);
        process.exit(1);
    }
});
start();
