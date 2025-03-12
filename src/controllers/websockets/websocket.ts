import type { FastifyRequest } from 'fastify';
import { validateString } from 'src/plugins/zod.js';
import type { WebSocket } from 'ws';
import { websocketService } from '../../services/impl/websocket.js';

export const websocketController = {
  // Manejador para conexiones de eco simple
  handleEchoConnection: (socket: WebSocket, _request: FastifyRequest) => {
    socket.on('message', (message: Buffer) => {
      const messageStr = message.toString();
      socket.send(`Echo: ${messageStr}`);
    });

    socket.on('close', () => {
      // Limpiar recursos cuando la conexión se cierre
    });
  },

  // Manejador para chat
  handleChatConnection: (socket: WebSocket, request: FastifyRequest) => {
    // Registrar la conexión del usuario en el servicio
    const data = request.query as { userId?: string };
    const userId = data.userId || `user-${Date.now()}`;
    websocketService.registerConnection(userId, socket);

    // Enviar mensaje de bienvenida
    socket.send(
      JSON.stringify({
        type: 'system',
        message: `Bienvenido al chat, tu ID es: ${userId}`,
        timestamp: new Date().toISOString(),
      })
    );

    // Manejar los mensajes entrantes
    socket.on('message', (message: Buffer) => {
      try {
        const messageData = JSON.parse(message.toString());
        websocketService.broadcastMessage(userId, messageData);
      } catch (error) {
        console.error('Error al procesar mensaje:', error);
        socket.send(
          JSON.stringify({
            type: 'error',
            message: 'Formato de mensaje inválido',
            timestamp: new Date().toISOString(),
          })
        );
      }
    });

    // Limpiar recursos cuando la conexión se cierre
    socket.on('close', () => {
      websocketService.removeConnection(userId);
    });
  },

  // Manejador para MatchMaking
  handleMatchMaking: (socket: WebSocket, request: FastifyRequest) => {
    const userId = request.query as { userId?: string };
    const userIdParsed = validateString(userId.userId);
    socket.on('message', async (message: Buffer) => {
      const matchId: string = await websocketService.matchMaking(userIdParsed, message);
      // Wait for matchmaking with a thread?
      socket.send(`The Id for your match is: ${matchId}`);
    });

    socket.on('close', () => {
      // Clean resources when the connection is closed
    });
  },

  // Game handler
  handleGameConnection: (_socket: WebSocket, _request: FastifyRequest) => {
    // TODO: Implementar
    // Here we should implement the game logic, for example, the game loop, the game state, the game rules, etc.
  },
};
