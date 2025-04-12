import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import { userRoutes } from "./routes/user";
import { tournamentRoutes } from "./routes/tournaments";
import { matchsRoutes } from "./routes/matchs";
import { keepAliveRoute } from "./routes/keep_alive";
import { get } from 'http';
import { FastifyInstance } from 'fastify';
import fs from 'fs';
import { join } from 'path';
import { MultipartFile } from "@fastify/multipart";

// export async function updateWallpaper(multipart: MultipartFile | undefined, userID: number): Promise<void>
// {
//     if (!multipart) {
//         throw new Error("No file provided");
//     }
//     const data = await multipart.file();
//     const fileName = data.filename;
//     const filePath = join(__dirname, '..', 'public', 'wallpapers', fileName);
//     const buffer = await data.toBuffer();
    

// }