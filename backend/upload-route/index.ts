import fastify from "fastify";
import database from "better-sqlite3";
import metrics from "fastify-metrics"
import rateLimit from '@fastify/rate-limit';
import { uploadRoutes } from "./routes/upload";
import multipart from '@fastify/multipart';


const Port = process.env.PORT || "0002"
const envUser = process.env.API_USERNAME || 'admin'
const envPassword = process.env.API_PASSWORD || 'admin'
export const salt = process.env.SALT || 'salt'
export const db = new database(`/usr/src/app/db/database.db`)

export const server = fastify({
	logger: true,
	bodyLimit: 10 * 1024 * 1024, // 10MB (ou la taille que vous souhaitez)
});

server.addHook('preHandler', async (req, reply) => {
  if (req.url.startsWith('/api/users/login') || req.url.startsWith('/metrics')) {
	return;
  }
 
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) 
	  return reply.code(401).send({ error: 'Unauthorized' });

	const token = authHeader.split(' ')[1];
	let tokenExists;
	try {
		tokenExists = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
	} catch (error) {
		server.log.error('Database query failed:', error);
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


server.get('/ping', async (request, replyX) => {
	return 'pong\n'
})

const start = async () => {
	try {
		await server.register(multipart, {
		  limits: {
			fileSize: 10 * 1024 * 1024 // 10MB
		  }});
		await server.register(rateLimit, {global: false});
		await server.register(metrics,{endpoint: '/metrics'});
		await server.register(uploadRoutes, { prefix: '/api/' });
		await server.listen({ port: Number(Port) , host: '0.0.0.0'})
		console.log('Server started sucessfully')
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}


start();

