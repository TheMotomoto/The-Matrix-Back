import { v4 as uuidv4 } from 'uuid';
import type { MatchDetails } from '../../../schemas/zod.js';
import AsyncList from '../../../utils/AsynctList.js';
import Match from '../../game/match/Match.js';
import type GameService from '../../game/services/GameService.js';

class GameServiceImpl implements GameService {
  private matches: AsyncList<Match>;
  static instance: GameServiceImpl;

  public static getInstance(): GameServiceImpl {
    if (!GameServiceImpl.instance) GameServiceImpl.instance = new GameServiceImpl();
    return GameServiceImpl.instance;
  }

  private constructor() {
    this.matches = new AsyncList<Match>();
  }
  public createMatch(host: string, guest: string, matchDetails: MatchDetails): Match {
    const matchId = uuidv4();
    const gameMatch = new Match(matchId, matchDetails.level, matchDetails.map, host, guest);
    this.matches.add(gameMatch);
    return gameMatch;
  }
  public async startMatch(_match: Match): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
      reject();
    });
  }
}
export default GameServiceImpl;
