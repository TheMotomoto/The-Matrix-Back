import type { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';
import { websocketController } from '@/controllers/websocket.js';

export async function websocketRoutes(fastify: FastifyInstance): Promise<void> {
  // Ruta básica para WebSocket
  fastify.get('/echo', { websocket: true }, (connection, req) => {
    websocketController.handleEchoConnection(connection, req);
  });

  // Ruta para chat
  fastify.get('/chat', { websocket: true }, (connection, req) => {
    websocketController.handleChatConnection(connection, req); // .socket
  });
}