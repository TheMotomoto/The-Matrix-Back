import type { MatchDetails } from 'src/schemas/zod.js';
import type Match from '../match/Match.js';

export default interface GameService {
  startMatch(matchId: string): Promise<void>;
  createMatch(match: MatchDetails): Match;
}
