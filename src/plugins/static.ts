import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

// Obtener el directorio actual para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, '..', '..');

export async function configureStatic(server: FastifyInstance): Promise<void> {
  await server.register(fastifyStatic, {
    root: path.join(rootPath, 'public'),
    prefix: '/public/',
  });
}
