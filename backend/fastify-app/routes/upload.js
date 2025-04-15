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
exports.createDirectory = createDirectory;
exports.uploadRoutes = uploadRoutes;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const user_1 = require("../user");
const user_2 = require("../user");
const user_3 = require("../user");
const BACK_VOLUME_DIR = "/server/img_storage/";
const FRONT_VOLUME_DIR = "/user_images/";
function createDirectory(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.mkdirSync(path, { recursive: true });
        }
    });
}
;
function uploadRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post('user_images/:type/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            console.log("uploading file");
            const { id, type } = request.params;
            const user = yield (0, user_1.getUserFromDb)(Number(id));
            if (user == null) {
                reply.code(404).send({ error: "User not found" });
                return;
            }
            const file = yield request.file();
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
                const user = yield (0, user_1.getUserFromDb)(Number(id));
                if (user == null) {
                    reply.code(404).send({ error: "User not found" });
                    return;
                }
                user.avatar = frontFilePath;
                yield (0, user_2.updateUserAvatar)(user, frontFilePath);
            }
            else if (type === "wallpaper") {
                const user = yield (0, user_1.getUserFromDb)(Number(id));
                if (user == null) {
                    reply.code(404).send({ error: "User not found" });
                    return;
                }
                user.background = frontFilePath;
                yield (0, user_3.updateUserBackground)(user, frontFilePath);
            }
            yield createDirectory(BACK_VOLUME_DIR);
            const bufferdata = yield file.toBuffer();
            fs_1.default.writeFile(filePath, bufferdata, (err) => {
                if (err) {
                    reply.code(400).send({ error: "Failed to save file" });
                    return;
                }
            });
            reply.code(200).send({ message: "File uploaded successfully" });
        }));
        server.get('/user_images/:type/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            console.log("get user image");
            const { id, type } = request.params;
            const user = yield (0, user_1.getUserFromDb)(Number(id));
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
        }));
        server.delete('/user_images/:type/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            console.log("delete user image");
            const { id, type } = request.params;
            const user = yield (0, user_1.getUserFromDb)(Number(id));
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
        }));
    });
}
