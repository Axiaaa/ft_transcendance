"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectory = createDirectory;
exports.uploadRoutes = uploadRoutes;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const user_1 = require("../user");
const user_2 = require("../user");
const user_3 = require("../user");
const BACK_VOLUME_DIR = "/server/img_storage/";
const FRONT_VOLUME_DIR = "/user_images/";
async function createDirectory(path) {
    if (!fs_1.default.existsSync(path)) {
        fs_1.default.mkdirSync(path, { recursive: true });
    }
}
;
async function uploadRoutes(server) {
    server.post('/user_images/:type/:id', async (request, reply) => {
        reply.log.info("upload user image");
        const { type, id } = request.params;
        const user = await (0, user_1.getUserFromDb)({ id: Number(id) });
        if (user == null) {
            reply.code(404).send({ error: "User not found" });
            return;
        }
        const file = await request.file();
        if (!file) {
            reply.code(400).send({ error: "No file provided" });
            return;
        }
        if (type !== "avatar" && type !== "wallpaper") {
            reply.code(400).send({ error: "Invalid type" });
            return;
        }
        const filePath = (0, path_1.join)(BACK_VOLUME_DIR, `${id}_${type}.png`);
        const frontFilePath = (0, path_1.join)(FRONT_VOLUME_DIR, `${id}_${type}.png`);
        if (type === "avatar") {
            const user = await (0, user_1.getUserFromDb)({ id: Number(id) });
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            user.avatar = frontFilePath;
            await (0, user_2.updateUserAvatar)(user, frontFilePath);
        }
        else if (type === "wallpaper") {
            const user = await (0, user_1.getUserFromDb)({ id: Number(id) });
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            user.background = frontFilePath;
            await (0, user_3.updateUserBackground)(user, frontFilePath);
        }
        await createDirectory(BACK_VOLUME_DIR);
        const bufferdata = await file.toBuffer();
        fs_1.default.writeFile(filePath, bufferdata, (err) => {
            if (err) {
                reply.code(400).send({ error: "Failed to save file" });
                return;
            }
        });
        reply.code(200).send({ message: "File uploaded successfully" });
    });
    server.get('/user_images/:type/:id', async (request, reply) => {
        console.log("get user image");
        const { id, type } = request.params;
        const user = await (0, user_1.getUserFromDb)({ id: Number(id) });
        if (user == null) {
            reply.code(404).send({ error: "User not found" });
            return;
        }
        const filePath = (0, path_1.join)(BACK_VOLUME_DIR, `${id}_${type}.png`);
        const fileFrontPath = (0, path_1.join)(FRONT_VOLUME_DIR, `${id}_${type}.png`);
        if (!fs_1.default.existsSync(filePath)) {
            reply.code(404).send({ error: "File not found" });
            return;
        }
        reply.code(200).send(fileFrontPath);
    });
    server.delete('/user_images/:type/:id', async (request, reply) => {
        console.log("delete user image");
        const { id, type } = request.params;
        const user = await (0, user_1.getUserFromDb)({ id: Number(id) });
        if (user == null) {
            reply.code(404).send({ error: "User not found" });
            return;
        }
        const filePath = (0, path_1.join)(BACK_VOLUME_DIR, `${id}_${type}.png`);
        const frontFilePath = (0, path_1.join)(FRONT_VOLUME_DIR, `${id}_${type}.png`);
        if (!fs_1.default.existsSync(filePath)) {
            reply.code(404).send({ error: "File not found" });
            return;
        }
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                reply.code(500).send({ error: "Failed to delete file" });
                return;
            }
            reply.code(200).send({ message: "File deleted successfully" });
        });
    });
}
