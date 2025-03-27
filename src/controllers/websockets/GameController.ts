import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';
import type GameService from '../../app/game/services/GameService.js';
import GameServiceImpl from '../../app/game/services/GameServiceImpl.js';
import { validateMatchDetails, validateString } from '../../schemas/zod.js';
import { logger, redis } from '../../server.js';

export default class GameController {
  private static instance: GameController;
  private gameService: GameService = GameServiceImpl.getInstance();
  private constructor() {}
  public static getInstance(): GameController {
    if (!GameController.instance) GameController.instance = new GameController();
    return GameController.instance;
  }
  // Game handler
  public async handleGameConnection(socket: WebSocket, request: FastifyRequest) {
    try {
      const { userId, matchId } = request.params as { userId: string; matchId: string };
      const matchIdParsed = validateString(matchId);
      const userIdParsed = validateString(userId);
      const matchDetails = validateMatchDetails(await redis.hgetall(`matches:${matchIdParsed}`));

      this.gameService.registerConnection(userIdParsed, socket);
      await this.gameService.startMatch(matchDetails.id);

      socket.send('Match started...');
      logger.info(
        `Player ${userId} connected to match ${matchDetails.id} \nHost: ${matchDetails.host} \nGuest: ${matchDetails.guest}`
      );

      socket.on('message', (message: Buffer) => {
        try {
          this.gameService.handleGameMessage(userIdParsed, matchIdParsed, message);
        } catch (error) {
          logger.warn('An error occurred on Game controller...');
          logger.error(error);
          socket.send('Internal server error');
        }
      });

      socket.on('close', () => {
        this.gameService.removeConnection(userIdParsed);
      });

      socket.on('error', (error: Error) => {
        logger.warn('An error occurred on Game controller...');
        logger.error(error);
      });
    } catch (error) {
      logger.warn('An error occurred on Game controller...');
      logger.error(error);
      socket.send('Internal server error');
      socket.close();
      return;
    }
  }
}
