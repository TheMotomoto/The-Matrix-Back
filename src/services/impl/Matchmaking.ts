import type { MatchDetails } from '../../plugins/zod.js';
import AsyncQueue from '../../utils/AsyncQueue.js';
import type Match from '../game/Match.js';
import type Player from '../game/characters/Player.js';
import type MatchMakingInterface from '../interfaces/MatchMakingService.js';
class MatchMaking implements MatchMakingInterface {
  private queue: AsyncQueue<Player>;
  private matches: AsyncQueue<Match>;
  private static instance: MatchMaking;
  private constructor() {
    this.queue = new AsyncQueue<Player>();
    this.matches = new AsyncQueue<Match>();
  }
  public searchMatch(_playerId: string, _match: MatchDetails): Promise<string> {
    // Tengo que implementar la lógica de buscar partida, por ahora la cola es suficiente

    return new Promise((resolve, reject) => {
      resolve('');
      reject();
    });
  }

  public startMatchMaking(_userId: Player): void {
    throw new Error('Method not implemented.');
  }

  public cancelMatchMaking(_userId: Player): void {
    throw new Error('Method not implemented.');
  }

  public static getInstance(): MatchMaking {
    if (!MatchMaking.instance) MatchMaking.instance = new MatchMaking();
    return MatchMaking.instance;
  }

  private async enqueue(player: Player): Promise<void> {
    await this.queue.enqueue(player);
  }

  private async dequeue(): Promise<Player | undefined> {
    return await this.queue.dequeue();
  }
}
export default MatchMaking;
