import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';

export default class GameController {
  private static instance: GameController;
  private constructor() {}
  public static getInstance(): GameController {
    if (!GameController.instance) GameController.instance = new GameController();
    return GameController.instance;
  }
  // Game handler
  public handleGameConnection(_socket: WebSocket, _request: FastifyRequest) {
    // TODO: Implementar
    // Here we should implement the game logic, for example, the game loop, the game state, the game rules, etc.
  }
}
