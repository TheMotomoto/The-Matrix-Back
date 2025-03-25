import type { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import type { WebSocket } from 'ws';
import WebsocketService from '../../app/WebSocketServiceImpl.js';
import {
  type MatchDetails,
  validateMatchDetails,
  validateMatchInputDTO,
  validateString,
} from '../../schemas/zod.js';
import { logger, redis } from '../../server.js';
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

  public async handleMatchMaking(socket: WebSocket, request: FastifyRequest) {
    try {
      const { matchId } = request.params as { matchId: string };
      const matchIdParsed = validateString(matchId);

      const match = validateMatchDetails(await redis.hgetall(`matches:${matchIdParsed}`));

      websocketService.registerConnection(match.host, socket);

      socket.send('Connected and looking for a match...');

      websocketService.matchMaking(match);

      logger.info(`Matchmaking from ${match.host}: looking for Match: ${JSON.stringify(match)}`);

      // Handle incoming messages
      socket.on('message', (_message: Buffer) => {
        socket.send('Matchmaking in progress...');
      });

      socket.on('close', () => {
        websocketService.removeConnection(match.host);
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

  public async handleCreateMatch(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { userId } = req.params as { userId: string };
    const userIdParsed = validateString(userId);
    logger.info(`Data is -----------> : ${JSON.stringify(req.body)}`);
    logger.info(`Data is -----------> : ${JSON.stringify(req.params)}`);
    const matchInputDTO = validateMatchInputDTO(req.body as string);
    logger.info(`Creating match for user ${userIdParsed}: ${JSON.stringify(matchInputDTO)}`);
    const matchDetails: MatchDetails = {
      id: uuidv4().replace(/-/g, '').slice(0, 8),
      host: userIdParsed,
      ...matchInputDTO,
    };

    redis.hset(
      `matches:${matchDetails.id}`,
      'id',
      matchDetails.id,
      'host',
      matchDetails.host,
      'guest',
      '',
      'level',
      matchDetails.level,
      'map',
      matchDetails.map
    );

    redis.expire(`matches:${matchDetails.id}`, 1 * 60 * 60);
    redis.hset(`users:${userIdParsed}`, 'match', matchDetails.id);
    return res.send(matchDetails.id);
  }

  public async handleGetMatch(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { userId } = req.params as { userId: string };
    const match = await redis.hgetall(`users:${userId}`);
    return res.send(match.match);
  }
}
