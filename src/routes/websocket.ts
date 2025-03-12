import type { FastifyInstance } from 'fastify';
import { websocketController } from '../controllers/websockets/websocket.js';

export async function websocketRoutes(fastify: FastifyInstance): Promise<void> {
  // Ruta básica para WebSocket
  fastify.get('/echo', { websocket: true }, (connection, req) => {
    websocketController.handleEchoConnection(connection, req);
  });

  // Ruta para chat
  fastify.get('/chat', { websocket: true }, (connection, req) => {
    websocketController.handleChatConnection(connection, req); // .socket
  });
  // Ruta para MatchMaking
  /**
   * This method works then i am looking for a matchmaking (no teamate)
   */
  fastify.get('/matchmaking', { websocket: true }, (connection, req) => {
    websocketController.handleMatchMaking(connection, req);
  });

  // Ruta para juego
  fastify.get('/game', { websocket: true }, (connection, req) => {
    websocketController.handleGameConnection(connection, req);
  });

  // Ruta para obtener una sala?
}
