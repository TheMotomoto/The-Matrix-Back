import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';
import WebsocketService from '../../app/WebSocketServiceImpl.js';
import { type MatchDetails, validateMatchDetails, validateString } from '../../schemas/zod.js';
import { logger } from '../../server.js';
import WebSocketError from './WebSocketError.js';
const websocketService = WebsocketService.getInstance();
/**
 * This class handles the errors different way a rest controller does.
 * It is responsible for managing WebSocket connections and handling messages.
 * It also provides matchmaking services for players looking for a match.
 */
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
    try {
      const { userIdParsed, match }: { userIdParsed: string; match: MatchDetails } = this.parseData(
        request.query
      );

      websocketService.registerConnection(userIdParsed, socket);
      socket.send('Connected and looking for a match...');
      websocketService.matchMaking(userIdParsed, match);
      logger.info(`Matchmaking from ${userIdParsed}: looking for Match: ${JSON.stringify(match)}`);

      // Handle incoming messages
      socket.on('message', (_message: Buffer) => {
        socket.send('Matchmaking in progress...');
      });

      socket.on('close', () => {
        // Clean resources when the connection is closed
        websocketService.removeConnection(userIdParsed);
      });

      socket.on('error', (error: Error) => {
        logger.warn('An error occurred on web scoket controller...');
        logger.error(error);
      });
    } catch (error) {
      logger.warn('An error occurred on web scoket controller...');
      logger.error(error);
      socket.send('Internal server error');
      socket.close();
      return;
    }
  }

  private parseData(query: unknown): { userIdParsed: string; match: MatchDetails } {
    const { userId, message } = query as { userId?: string; message?: string };
    if (message === undefined) throw new WebSocketError(WebSocketError.BAD_WEB_SOCKET_REQUEST);
    const matchRaw = JSON.parse(message);
    const userIdParsed = validateString(userId);
    const match = validateMatchDetails(matchRaw);
    return { userIdParsed, match };
  }
}
