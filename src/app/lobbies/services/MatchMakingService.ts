import type { MatchDetails } from 'src/schemas/zod.js';

interface MatchMakingService {
  searchMatch: (playerId: string, match: MatchDetails) => Promise<void>;
}
export default MatchMakingService;
