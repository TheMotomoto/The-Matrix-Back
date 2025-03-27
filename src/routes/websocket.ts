import type { FastifyInstance } from 'fastify';
import GameController from '../controllers/websockets/GameController.js';
import MatchMakingController from '../controllers/websockets/MatchMakingController.js';

const matchMakingController: MatchMakingController = MatchMakingController.getInstance();
const gameController: GameController = GameController.getInstance();

export async function websocketRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * This method works then i am looking for a matchmaking (no teamate)
   */
  fastify.get('/matchmaking/:matchId', { websocket: true }, (connection, req) => {
    matchMakingController.handleMatchMaking(connection, req);
  });

  /**
   * This route works then i am looking for a game (with teamate) (the match is already created and I know it's id)
   */
  fastify.get('/game/:userId/:matchId', { websocket: true }, (connection, req) => {
    gameController.handleGameConnection(connection, req);
  });
}
