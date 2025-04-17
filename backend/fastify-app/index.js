"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.db = exports.salt = void 0;
const fastify_1 = __importDefault(require("fastify"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fastify_metrics_1 = __importDefault(require("fastify-metrics"));
const user_1 = require("./routes/user");
const matchs_1 = require("./routes/matchs");
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const keep_alive_1 = require("./routes/keep_alive");
const upload_1 = require("./routes/upload");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const Port = process.env.PORT || 4321;
const envUser = process.env.API_USERNAME || 'admin';
const envPassword = process.env.API_PASSWORD || 'admin';
exports.salt = process.env.SALT || 'salt';
exports.db = new better_sqlite3_1.default(`/usr/src/app/db/database.db`);
exports.server = (0, fastify_1.default)({
    logger: true
});
exports.server.addHook('preHandler', async (req, reply) => {
    if (req.url.startsWith('/api/users/login')) {
        return;
    }
    const authHeader = req.headers.authorization;
    exports.server.log.info('Auth Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return reply.code(401).send({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    let tokenExists;
    try {
        tokenExists = exports.db.prepare('SELECT * FROM users WHERE token = ?').get(token);
    }
    catch (error) {
        exports.server.log.error('Database query failed:', error);
        return reply.code(409).send({ error: 'Internal Server Error' });
    }
    if (!tokenExists) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }
    // if (req.method === 'POST' || req.method === 'PATCH') {
    //   try {
    //     JSON.parse(JSON.stringify(req.body));
    //   } catch (error) {
    //     return reply.code(400).send({ error: 'Invalid JSON body' });
    //   }
    // }
});
exports.server.get('/ping', async (request, replyX) => {
    return 'pong\n';
});
const start = async () => {
    try {
        await exports.server.register(multipart_1.default);
        await exports.server.register(rate_limit_1.default, { global: false });
        await exports.server.register(fastify_metrics_1.default, { endpoint: '/metrics' });
        await exports.server.register(user_1.userRoutes, { prefix: '/api' });
        await exports.server.register(matchs_1.matchsRoutes, { prefix: '/api' });
        await exports.server.register(keep_alive_1.keepAliveRoute, { prefix: '/api' });
        await exports.server.register(upload_1.uploadRoutes, { prefix: '/api' });
        await exports.server.listen({ port: Number(Port), host: '0.0.0.0' });
        console.log('Server started sucessfully');
    }
    catch (err) {
        exports.server.log.error(err);
        process.exit(1);
    }
};
start();
