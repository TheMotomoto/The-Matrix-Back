import type { MatchDetails } from '../../../schemas/zod.js';
import { redis } from '../../../server.js';
import AsyncMap from '../../../utils/AsyncMap.js';
import MatchError from '../../errors/MatchError.js';
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
  public createMatch(matchDetails: MatchDetails): Match {
    if (!matchDetails.guest) throw new MatchError(MatchError.MATCH_CANNOT_BE_CREATED);
    const gameMatch = new Match(
      matchDetails.id,
      matchDetails.level,
      matchDetails.map,
      matchDetails.host,
      matchDetails.guest
    );
    this.matches.add(matchDetails.id, gameMatch);
    // Update users with match id
    redis.hset(`users:${matchDetails.host}`, 'match', matchDetails.id);
    redis.hset(`users:${matchDetails.guest}`, 'match', matchDetails.id);
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
