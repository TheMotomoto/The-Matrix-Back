import type { MatchDetails } from 'src/plugins/zod.js';

interface MatchMakingService {
  searchMatch: (playerId: string, match: MatchDetails) => Promise<string>; // returns the match id
}
export default MatchMakingService;
