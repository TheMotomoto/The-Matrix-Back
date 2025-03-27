import type { MatchDetails } from 'src/schemas/zod.js';

interface MatchMakingService {
  searchMatch: (match: MatchDetails) => Promise<void>;
}
export default MatchMakingService;
