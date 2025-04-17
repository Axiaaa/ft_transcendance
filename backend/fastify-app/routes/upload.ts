import { FastifyInstance } from "fastify";
import { server, db } from "..";
import fs from "fs";
import { join } from "path";
import { MultipartFile } from "@fastify/multipart";
import { getUserFromDb } from "../user";
import { User } from "../user";
import { updateUserAvatar } from "../user";
import { updateUserBackground } from "../user";

const BACK_VOLUME_DIR = "/server/img_storage/"
const FRONT_VOLUME_DIR = "/user_images/"

export async function createDirectory(path: string) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
};

export async function uploadRoutes(server: FastifyInstance) {

	server.post<{ Params: { id: number, type: string}, Body: { file: MultipartFile } }>('/user_images/:type/:id', async (request, reply) => {
		reply.log.info("upload user image");
		const { type, id } = request.params;
		const user = await getUserFromDb({ id: Number(id) });
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			return;
		}
		const file = await request.file();
		if (!file) {
			reply.code(400).send({error: "No file provided"});
			return;
		}
		if (type !== "avatar" && type !== "wallpaper") {
			reply.code(400).send({error: "Invalid type"});
			return;
		}
		const filePath = join(BACK_VOLUME_DIR, `${id}_${type}.png`);
		const frontFilePath = join(FRONT_VOLUME_DIR, `${id}_${type}.png`);
		if (type === "avatar") {
			const user = await getUserFromDb({ id: Number(id) });
			if (user == null) {
				reply.code(404).send({error: "User not found"});
				return;
			}
			user.avatar = frontFilePath;
			await updateUserAvatar(user, frontFilePath);
		}
		else if (type === "wallpaper") {
			const user = await getUserFromDb({ id: Number(id) });
			if (user == null) {
				reply.code(404).send({error: "User not found"});
				return;
			}
			user.background = frontFilePath;
			await updateUserBackground(user, frontFilePath);
		}
		await createDirectory(BACK_VOLUME_DIR);
		const bufferdata = await file.toBuffer();
		fs.writeFile(filePath, bufferdata, (err) => {
			if (err) {
				reply.code(400).send({error: "Failed to save file"});
				return;
			}
		});
		reply.code(200).send({message: "File uploaded successfully"});
	});

	server.get<{ Params: { id: string, type: string } }>('/user_images/:type/:id', async (request, reply) => {
		reply.log.info("get user image");
		const { id, type } = request.params;
		const user = await getUserFromDb({ id: Number(id) });
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			return;
		}
		const filePath = join(BACK_VOLUME_DIR, `${id}_${type}.png`);
		const fileFrontPath = join(FRONT_VOLUME_DIR, `${id}_${type}.png`);
		if (!fs.existsSync(filePath)) {
			reply.code(404).send({error: "File not found"});
			return;
		}
		reply.code(200).send(fileFrontPath);
	});

	server.delete<{ Params: { id: string, type: string } }>('/user_images/:type/:id', async (request, reply) => {
		const { id, type } = request.params;
		const user = await getUserFromDb({ id: Number(id) });
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			return;
		}
		if (type !== "avatar" && type !== "wallpaper") {
			reply.code(400).send({error: "Invalid type"});
			return;
		}
		const filePath = join(BACK_VOLUME_DIR, `${id}_${type}.png`);
		const frontFilePath = join(FRONT_VOLUME_DIR, `${id}_${type}.png`);
		if (!fs.existsSync(filePath)) {
			reply.code(404).send({error: "File not found"});
			return;
		}

		try {
			// Convert fs.unlink to Promise-based to work properly with async/await
			await new Promise<void>((resolve, reject) => {
				fs.unlink(filePath, (err) => {
					if (err) reject(err);
					else resolve();
				});
			});
			
			// Update user record if necessary
			if (type === "avatar") {
				user.avatar = "";
				await updateUserAvatar(user, "");
			} else if (type === "wallpaper") {
				user.background = "";
				await updateUserBackground(user, "");
			}
			
			reply.code(200).send({message: "File deleted successfully"});
		} catch (err) {
			reply.log.error(err);
			reply.code(500).send({error: "Failed to delete file"});
		}
	});
}