import { FastifyInstance } from "fastify";
import { server, db } from "..";
import fs from "fs";
import { join } from "path";
import { MultipartFile } from "@fastify/multipart";
import { getUserFromDb } from "../user";
import { User } from "../user";
import { updateUserAvatar } from "../user";
import { updateUserBackground } from "../user";

const VOLUME_DIR = "/server/img_storage/"

export async function createDirectory(path: string) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
};

export async function uploadRoutes(server: FastifyInstance) {

	server.post<{ Params: { id: string, type: string}, Body: { file: MultipartFile } }>('/user_images/:type/:id', async (request, reply) => {
		const { id, type } = request.params;
		const user = await getUserFromDb(Number(id));
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			return;
		}
		const file = request.body.file;
		if (!file) {
			reply.code(400).send({error: "No file provided"});
			return;
		}
		if (type !== "avatar" && type !== "wallpaper") {
			reply.code(400).send({error: "Invalid type"});
			return;
		}
		const filePath = join(VOLUME_DIR, `${id}_${type}.png`);
		if (type === "avatar") {
			const user = await getUserFromDb(Number(id));
			if (user == null) {
				reply.code(404).send({error: "User not found"});
				return;
			}
			user.avatar = filePath;
			await updateUserAvatar(user, filePath);
		}
		else if (type === "wallpaper") {
			const user = await getUserFromDb(Number(id));
			if (user == null) {
				reply.code(404).send({error: "User not found"});
				return;
			}
			user.background = filePath;
			await updateUserBackground(user, filePath);
		}
		await createDirectory(VOLUME_DIR);
		const bufferdata = await file.toBuffer();
		fs.writeFile(filePath, bufferdata, (err) => {
			if (err) {
				reply.code(500).send({error: "Failed to save file"});
				return;
			}
			reply.code(200).send({message: "File uploaded successfully"});
		});
	});

	server.get<{ Params: { id: string, type: string } }>('/user_images/:type/:id', async (request, reply) => {
		const { id, type } = request.params;
		const user = await getUserFromDb(Number(id));
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			return;
		}
		const filePath = join(VOLUME_DIR, `${id}_${type}.png`);
		if (!fs.existsSync(filePath)) {
			reply.code(404).send({error: "File not found"});
			return;
		}
		reply.code(200).send(filePath);
	});

	server.delete<{ Params: { id: string, type: string } }>('/user_images/:type/:id', async (request, reply) => {
		const { id, type } = request.params;
		const user = await getUserFromDb(Number(id));
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			return;
		}
		const filePath = join(VOLUME_DIR, `${id}_${type}.png`);
		if (!fs.existsSync(filePath)) {
			reply.code(404).send({error: "File not found"});
			return;
		}
		fs.unlink(filePath, (err) => {
			if (err) {
				reply.code(500).send({error: "Failed to delete file"});
				return;
			}
			reply.code(200).send({message: "File deleted successfully"});
		});
	});
}