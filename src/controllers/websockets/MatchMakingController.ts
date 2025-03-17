import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';
import WebsocketService from '../../app/WebSocketServiceImpl.js';
import { validateString } from '../../schemas/zod.js';

const websocketService = WebsocketService.getInstance();

export default class MatchMakingController {
  // Singleton instace
  private static instance: MatchMakingController;
  private constructor() {}
  public static getInstance(): MatchMakingController {
    if (!MatchMakingController.instance)
      MatchMakingController.instance = new MatchMakingController();
    return MatchMakingController.instance;
  }

  public handleMatchMaking(socket: WebSocket, request: FastifyRequest) {
    const { userId, message } = request.query as { userId?: string; message?: string };
    const userIdParsed = validateString(userId);
    websocketService.registerConnection(userIdParsed, socket);
    socket.send('Connected and looking for a match...');
    websocketService.matchMaking(userIdParsed, message);
    // Handle incoming messages
    socket.on('message', (_message: Buffer) => {
      socket.send('Matchmaking in progress...');
    });

    socket.on('close', () => {
      // Clean resources when the connection is closed
      websocketService.removeConnection(userIdParsed);
    });
  }
}
