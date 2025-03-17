import type { FastifyInstance } from 'fastify';
import { configureEnv } from './env.js';
import { configureRedis } from './redis.js';
import { configureStatic } from './static.js';
import { configureWebSocket } from './websocket.js';
// import fastifyCors from '@fastify/cors';

export async function registerPlugins(server: FastifyInstance): Promise<void> {
  // Cargar variables de entorno primero
  await configureEnv(server);

  // Configurar CORS
  //await server.register(fastifyCors, {
  //  origin: server.config.CORS_ORIGIN === '*'
  //    ? true
  //    : server.config.CORS_ORIGIN.split(','),
  //  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //  credentials: true
  //});

  // Configurar WebSocket
  await configureWebSocket(server);
  // Configurar rutas
  await configureStatic(server);
  // Configurar Redis
  await configureRedis(server);

  // Aquí puedes registrar más plugins según sea necesario
}
