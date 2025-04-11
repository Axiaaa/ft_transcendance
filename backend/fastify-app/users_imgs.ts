import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { userRoutes } from "./routes/user";
import { tournamentRoutes } from "./routes/tournaments";
import { matchsRoutes } from "./routes/matchs";
import { keepAliveRoute } from "./routes/keep_alive";

