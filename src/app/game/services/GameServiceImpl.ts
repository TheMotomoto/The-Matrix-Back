import { v4 as uuidv4 } from 'uuid';
import type { MatchDetails } from '../../../schemas/zod.js';
import AsyncMap from '../../../utils/AsyncMap.js';
import Match from '../../game/match/Match.js';
import type GameService from '../../game/services/GameService.js';

class GameServiceImpl implements GameService {
  private matches: AsyncMap<string, Match>;
  static instance: GameServiceImpl;

  public static getInstance(): GameServiceImpl {
    if (!GameServiceImpl.instance) GameServiceImpl.instance = new GameServiceImpl();
    return GameServiceImpl.instance;
  }

  private constructor() {
    this.matches = new AsyncMap<string, Match>();
  }
  public createMatch(host: string, guest: string, matchDetails: MatchDetails): Match {
    const matchId = uuidv4();
    const gameMatch = new Match(matchId, matchDetails.level, matchDetails.map, host, guest);
    this.matches.add(matchId, gameMatch);
    return gameMatch;
  }
  public async startMatch(matchId: string): Promise<void> {
    const gameMatch = await this.matches.get(matchId);
    if (!gameMatch) throw new Error('Match not found');
    await gameMatch.start();
    return;
  }
}
export default GameServiceImpl;
