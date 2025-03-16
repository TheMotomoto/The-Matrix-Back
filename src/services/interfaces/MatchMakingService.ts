import type { MatchDetails } from 'src/plugins/zod.js';
import type WebSocketService from '../impl/WebSocketService.js';

interface MatchMakingService {
  searchMatch: (playerId: string, match: MatchDetails) => Promise<void>;
}
export default MatchMakingService;
