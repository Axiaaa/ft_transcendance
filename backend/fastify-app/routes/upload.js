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
async function checkImageValidity(file) {
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validImageTypes.includes(file.mimetype)) {
        return false;
    }
    const buffer = await file.toBuffer();
    if (buffer.length > 5 * 1024 * 1024) { // 5MB limit
        return false;
    }
    // Check file signature (magic numbers)
    if (file.mimetype === 'image/png') {
        // PNG signature: 89 50 4E 47 0D 0A 1A 0A
        if (buffer.length < 8 ||
            buffer[0] !== 0x89 ||
            buffer[1] !== 0x50 ||
            buffer[2] !== 0x4E ||
            buffer[3] !== 0x47 ||
            buffer[4] !== 0x0D ||
            buffer[5] !== 0x0A ||
            buffer[6] !== 0x1A ||
            buffer[7] !== 0x0A) {
            return false;
        }
    }
    else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        // JPEG signature: starts with FF D8 FF
        if (buffer.length < 3 ||
            buffer[0] !== 0xFF ||
            buffer[1] !== 0xD8 ||
            buffer[2] !== 0xFF) {
            return false;
        }
    }
    return true;
}
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
        if (!await checkImageValidity(file)) {
            reply.code(400).send({ error: "Invalid image file" });
            return;
        }
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg") {
            reply.code(400).send({ error: "Invalid image type" });
            return;
        }
        const bufferdata = await file.toBuffer();
        if (!bufferdata) {
            reply.code(400).send({ error: "Failed to read file" });
            return;
        }
        if (bufferdata.length > 5 * 1024 * 1024) { // 5MB limit
            reply.code(400).send({ error: "File size exceeds limit" });
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
        fs_1.default.writeFile(filePath, bufferdata, (err) => {
            if (err) {
                reply.code(400).send({ error: "Failed to save file" });
                return;
            }
        });
        reply.code(200).send({ message: "File uploaded successfully" });
    });
    server.get('/user_images/:type/:id', async (request, reply) => {
        reply.log.info("get user image");
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
        const { id, type } = request.params;
        const user = await (0, user_1.getUserFromDb)({ id: Number(id) });
        if (user == null) {
            reply.code(404).send({ error: "User not found" });
            return;
        }
        if (type !== "avatar" && type !== "wallpaper") {
            reply.code(400).send({ error: "Invalid type" });
            return;
        }
        const filePath = (0, path_1.join)(BACK_VOLUME_DIR, `${id}_${type}.png`);
        const frontFilePath = (0, path_1.join)(FRONT_VOLUME_DIR, `${id}_${type}.png`);
        if (!fs_1.default.existsSync(filePath)) {
            reply.code(404).send({ error: "File not found" });
            return;
        }
        try {
            // Convert fs.unlink to Promise-based to work properly with async/await
            await new Promise((resolve, reject) => {
                fs_1.default.unlink(filePath, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
            // Update user record if necessary
            if (type === "avatar") {
                user.avatar = "";
                await (0, user_2.updateUserAvatar)(user, "");
            }
            else if (type === "wallpaper") {
                user.background = "";
                await (0, user_3.updateUserBackground)(user, "");
            }
            reply.code(200).send({ message: "File deleted successfully" });
        }
        catch (err) {
            reply.log.error(err);
            reply.code(500).send({ error: "Failed to delete file" });
        }
    });
}
