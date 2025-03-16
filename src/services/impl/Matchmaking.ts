import type { MatchDetails } from '../../plugins/zod.js';
import AsyncQueue from '../../utils/AsyncQueue.js';
import type Match from '../game/Match.js';
import Player from '../game/characters/Player.js';
import type GameService from '../interfaces/GameService.js';
import type MatchMakingInterface from '../interfaces/MatchMakingService.js';
import GameServiceImpl from './GameService.js';
import type WebSocketService from './WebSocketService.js';
class MatchMaking implements MatchMakingInterface {
  // Matchmaking queue
  private queue: AsyncQueue<Player>;
  // Queue of matches (matches in progress) Should be shared between
  private static instance: MatchMaking;
  // Game service (the logic of the game)
  private gameService: GameService;
  private webSocketService: WebSocketService;

  private constructor(webSocketService: WebSocketService) {
    this.queue = new AsyncQueue<Player>();
    this.gameService = GameServiceImpl.getInstance(); // Manual dependency injection
    this.webSocketService = webSocketService;
  }

  // TODO Implement logic of different matches types (difficulties, maps, etc)
  public searchMatch(playerId: string, matchDetails: MatchDetails): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.queue.dequeue().then((player?: Player) => {
        if (player !== undefined) {
          console.info(`Match found for ${playerId} and ${player.getId()}`);
          const match = this.createMatch(playerId, player.getId(), matchDetails);
          this.webSocketService.notifyMatchFound(match);
          resolve(); // Create match
        } else {
          console.info(
            `Match not found for ${playerId} so it was enqueued for match: ${JSON.stringify(matchDetails)}`
          );
          this.queue.enqueue(new Player(playerId, null));
          resolve(); // Match not found
        }
      });
    });
  }

  public startMatchMaking(_userId: Player): void {
    throw new Error('Method not implemented.');
  }

  public cancelMatchMaking(_userId: Player): void {
    throw new Error('Method not implemented.');
  }

  public static getInstance(webSocketService: WebSocketService): MatchMaking {
    if (!MatchMaking.instance) MatchMaking.instance = new MatchMaking(webSocketService);
    return MatchMaking.instance;
  }

  private async enqueue(player: Player): Promise<void> {
    await this.queue.enqueue(player);
  }

  private async dequeue(): Promise<Player | undefined> {
    return await this.queue.dequeue();
  }

  private createMatch(host: string, guest: string, match: MatchDetails): Match {
    return this.gameService.createMatch(host, guest, match);
  }
}
export default MatchMaking;
