import type AsyncQueueInterface from 'src/utils/AsyncQueueInterface.js';
import type { MatchDetails } from '../../../schemas/zod.js';
import { logger, redis } from '../../../server.js';
import AsyncQueue from '../../../utils/AsyncQueue.js';
import type WebSocketService from '../../WebSocketServiceImpl.js';
import type Match from '../../game/match/Match.js';
import type GameService from '../../game/services/GameService.js';
import GameServiceImpl from '../../game/services/GameServiceImpl.js';
import type MatchMakingInterface from '../../lobbies/services/MatchMakingService.js';
class MatchMaking implements MatchMakingInterface {
  // Matchmaking queue
  private queue: AsyncQueueInterface<string>;
  // Queue of matches (matches in progress) Should be shared between
  // Game service (the logic of the game)
  private gameService: GameService;
  private webSocketService: WebSocketService;

  // Singleton instance
  private static instance: MatchMaking;
  private constructor(webSocketService: WebSocketService) {
    this.queue = new AsyncQueue<string>();
    this.gameService = GameServiceImpl.getInstance(); // Manual dependency injection
    this.webSocketService = webSocketService;
  }
  public static getInstance(webSocketService: WebSocketService): MatchMaking {
    if (!MatchMaking.instance) MatchMaking.instance = new MatchMaking(webSocketService);
    return MatchMaking.instance;
  }

  // TODO -- Priority 3 --> Implement logic of different matches types (difficulties, maps, etc)
  public async searchMatch(matchDetails: MatchDetails): Promise<void> {
    const host = await this.queue.dequeue(); // Esperamos a que la promesa de dequeue se resuelva
    const guest = matchDetails.host;
    if (host !== undefined) {
      logger.info(`\nMatch found for ${guest} and ${host}\n`);
      matchDetails.host = host;
      matchDetails.guest = guest;
      await redis.hset(`users:${host}`, 'match', matchDetails.id);
      await redis.hset(`matches:${matchDetails.id}`, 'guest', guest, 'host', host);
      const match = this.createMatch(matchDetails);
      this.webSocketService.notifyMatchFound(match);
    } else {
      logger.info(
        `Match not found for ${guest} so it was enqueued for match: ${JSON.stringify(matchDetails)}`
      );
      this.queue.enqueue(guest);
    }
  }

  public cancelMatchMaking(_userId: string): void {
    throw new Error('Method not implemented.');
  }

  private createMatch(match: MatchDetails): Match {
    return this.gameService.createMatch(match);
  }
}
export default MatchMaking;
