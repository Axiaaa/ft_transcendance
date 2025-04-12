import { FastifyInstance } from "fastify";
import { server, db } from "..";
import fs from "fs";
import { join } from "path";
import { MultipartFile } from "@fastify/multipart";
import { getUserFromDb } from "../user";
import { User } from "../user";

