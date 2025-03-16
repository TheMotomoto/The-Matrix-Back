import type { FastifyInstance } from 'fastify';
// Ejemplo al importar una ruta
import { websocketRoutes } from './websocket.js';

export async function registerRoutes(server: FastifyInstance): Promise<void> {
  // Websocket
  await server.register(websocketRoutes, { prefix: '/ws' });

  // REST
  //await server.register(helloRoutes, { prefix: '/rest/users' });
  // await server.register(userRoutes, { prefix: '/api/users' });
  // await server.register(productRoutes, { prefix: '/api/products' });
}
