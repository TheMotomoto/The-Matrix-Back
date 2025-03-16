import type { FastifyInstance } from 'fastify';
import { restRoutes } from './rest.js';
// Ejemplo al importar una ruta
import { websocketRoutes } from './websocket.js';

export async function registerRoutes(server: FastifyInstance): Promise<void> {
  // Websocket
  await server.register(websocketRoutes, { prefix: '/ws' });
  // REST
  await server.register(restRoutes, { prefix: '/rest' });
}
