import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Obtener el directorio actual para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, '..', '..');
console.log('rootPath:', path.join(rootPath, 'public'));

export async function configureStatic(server: FastifyInstance): Promise<void> {
  await server.register(fastifyStatic, {
    root: path.join(rootPath, 'public'),
    prefix: '/public/',
  });
}