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


async function checkImageValidity(file: MultipartFile): Promise<boolean> {
	const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
	if (!validImageTypes.includes(file.mimetype)) {
		throw new Error('Invalid image type');
	}
	const buffer = await file.toBuffer();
	if (buffer.length > 5 * 1024 * 1024) { // 5MB limit
		throw new Error('File size exceeds limit of 5MB');
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
			throw new Error('Invalid PNG file');
		}
	} else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
		// JPEG signature: starts with FF D8 FF
		if (buffer.length < 3 || 
				buffer[0] !== 0xFF || 
				buffer[1] !== 0xD8 || 
				buffer[2] !== 0xFF) {
			throw new Error('Invalid JPEG / JPG file');
		}
	}
	return true;
}

export async function uploadRoutes(server: FastifyInstance) {

	server.post<{ Params: { id: number, type: string}, Body: { file: MultipartFile } }>('/user_images/:type/:id', async (request, reply) => {
		reply.log.info("upload user image");
		const { type, id } = request.params;
		const user = await getUserFromDb({ id: Number(id) });
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			throw new Error("User not found");
		}
		const file = await request.file();
		if (!file) {
			reply.code(400).send({error: "No file provided"});
			throw new Error("No file provided");
		}
		if (type !== "avatar" && type !== "wallpaper") {
			reply.code(400).send({error: "Invalid type"});
			throw new Error("Invalid type");
		}
		if (!await checkImageValidity(file)) {
			reply.code(400).send({error: "Invalid image file"});
			throw new Error("Invalid image file");
		}
		const bufferdata = await file.toBuffer();
		if (!bufferdata) {
			reply.code(400).send({error: "Failed to read file"});
			throw new Error("Failed to read file");
		}
		const filePath = join(BACK_VOLUME_DIR, `${id}_${type}.png`);
		const frontFilePath = join(FRONT_VOLUME_DIR, `${id}_${type}.png`);
		if (type === "avatar") {
			const user = await getUserFromDb({ id: Number(id) });
			if (user == null) {
				reply.code(404).send({error: "User not found"});
				throw new Error("User not found");
			}
			user.avatar = frontFilePath;
			await updateUserAvatar(user, frontFilePath);
		}
		else if (type === "wallpaper") {
			const user = await getUserFromDb({ id: Number(id) });
			if (user == null) {
				reply.code(404).send({error: "User not found"});
				throw new Error("User not found");
			}
			user.background = frontFilePath;
			await updateUserBackground(user, frontFilePath);
		}
		await createDirectory(BACK_VOLUME_DIR);
		fs.writeFile(filePath, bufferdata, (err) => {
			if (err) {
				reply.code(400).send({error: "Failed to save file"});
				throw new Error("Failed to save file");
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
			throw new Error("User not found");
		}
		const filePath = join(BACK_VOLUME_DIR, `${id}_${type}.png`);
		const fileFrontPath = join(FRONT_VOLUME_DIR, `${id}_${type}.png`);
		if (!fs.existsSync(filePath)) {
			reply.code(404).send({error: "File not found"});
			throw new Error("File not found");
		}
		reply.code(200).send(fileFrontPath);
	});

	server.delete<{ Params: { id: string, type: string } }>('/user_images/:type/:id', async (request, reply) => {
		const { id, type } = request.params;
		const user = await getUserFromDb({ id: Number(id) });
		if (user == null) {
			reply.code(404).send({error: "User not found"});
			throw new Error("User not found");
		}
		if (type !== "avatar" && type !== "wallpaper") {
			reply.code(400).send({error: "Invalid type"});
			throw new Error("Invalid type");
		}
		const filePath = join(BACK_VOLUME_DIR, `${id}_${type}.png`);
		const frontFilePath = join(FRONT_VOLUME_DIR, `${id}_${type}.png`);
		if (!fs.existsSync(filePath)) {
			reply.code(404).send({error: "File not found"});
			throw new Error("File not found");
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