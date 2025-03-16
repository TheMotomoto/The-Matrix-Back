import type { MatchDetails } from 'src/schemas/zod.js';
import type Match from '../match/Match.js';

export default interface GameService {
  startMatch(match: Match): Promise<void>;
  createMatch(host: string, guest: string, match: MatchDetails): Match;
}
