import type { FastifyInstance } from 'fastify';
import { helloRoutes } from './hello.js';
// Ejemplo al importar una ruta
import { websocketRoutes } from './websocket.js';

export async function registerRoutes(server: FastifyInstance): Promise<void> {
  // Registrar endpointss
  await server.register(helloRoutes, { prefix: '/hello' });
  await server.register(websocketRoutes, { prefix: '/ws' });
  // await server.register(userRoutes, { prefix: '/api/users' });
  // await server.register(productRoutes, { prefix: '/api/products' });
}
