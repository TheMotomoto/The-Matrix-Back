import type { MatchDetails } from '../../plugins/zod.js';
import AsyncQueue from '../../utils/AsyncQueue.js';
import Match from '../game/Match.js';
import type GameService from '../interfaces/GameService.js';

class GameServiceImpl implements GameService {
  private matches: AsyncQueue<Match>;
  static instance: GameServiceImpl;

  public static getInstance(): GameServiceImpl {
    if (!GameServiceImpl.instance) GameServiceImpl.instance = new GameServiceImpl();
    return GameServiceImpl.instance;
  }

  private constructor() {
    this.matches = new AsyncQueue<Match>();
  }
  public createMatch(host: string, guest: string, matchDetails: MatchDetails): Match {
    const matchId = '1234';
    const gameMatch = new Match(matchId, matchDetails.level, matchDetails.map, host, guest);
    return gameMatch;
  }
  startMatch(_match: Match): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
      reject();
    });
  }
  // TODO: Implement the GameService interface
}
export default GameServiceImpl;
