import fastifyWebsocket from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';

export async function configureWebSocket(server: FastifyInstance): Promise<void> {
  await server.register(fastifyWebsocket, {
    options: { maxPayload: 1048576 /*pingInterval: 30000, pongTimeout: 10000*/ },
  });
  //  maxPayload: 1048576, // 1MB - tamaño máximo de mensaje
  //pingInterval: 30000, // Intervalo de ping en ms
  //pongTimeout: 10000   // Tiempo de espera para pong en ms
}
