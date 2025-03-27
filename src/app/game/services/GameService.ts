import type { WebSocket } from 'ws';
import type { MatchDetails } from '../../../schemas/zod.js';
import type Match from '../match/Match.js';

export default interface GameService {
  startMatch(matchId: string): Promise<void>;
  createMatch(match: MatchDetails): Match;
  registerConnection(user: string, socket: WebSocket): void;
  removeConnection(user: string): void;
  handleGameMessage(user: string, matchId: string, message: Buffer): void;
  getMatch(matchId: string): Match | undefined;
}
