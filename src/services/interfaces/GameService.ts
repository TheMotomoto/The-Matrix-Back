import type { MatchDetails } from 'src/plugins/zod.js';
import type Match from '../game/Match.js';

export default interface GameService {
  startMatch(match: Match): Promise<void>;
  createMatch(host: string, guest: string, match: MatchDetails): Match;
}
