import { WebSocket } from 'ws';
import type { MatchDetails } from '../schemas/zod.js';
import { logger, redis } from '../server.js';
import type Match from './game/match/Match.js';
import type MatchMakingService from './lobbies/services/MatchMakingService.js';
import MatchMaking from './lobbies/services/MatchmakingImpl.js';

/**
 * This class is responsible for managing WebSocket connections and handling messages.
 * It also provides matchmaking services for players looking for a match.
 */
export default class WebsocketService {
  private static instance: WebsocketService;
  private connections: Map<string, WebSocket>;
  private matchMakingService: MatchMakingService;
  public static getInstance(): WebsocketService {
    if (!WebsocketService.instance) WebsocketService.instance = new WebsocketService();
    return WebsocketService.instance;
  }
  private constructor() {
    this.connections = new Map(); // --> This should be a database (Redis)
    this.matchMakingService = MatchMaking.getInstance(this);
  }

  public registerConnection(userId: string, socket: WebSocket): void {
    this.connections.set(userId, socket);
  }

  public removeConnection(userId: string): void {
    this.connections.delete(userId);
  }

  // Enviar un mensaje del sistema a todos los usuarios
  public broadcastSystemMessage(message: string): void {
    const systemMessage = {
      type: 'system',
      message,
      timestamp: new Date().toISOString(),
    };
    const messageStr = JSON.stringify(systemMessage);
    for (const socket of this.connections.values()) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
      }
    }
  }

  public async matchMaking(match: MatchDetails): Promise<void> {
    this.matchMakingService.searchMatch(match);
  }

  public async notifyMatchFound(match: Match, ghostMatch: string): Promise<void> {
    try {
      const hostSocket = this.connections.get(match.getHost());
      const guestSocket = this.connections.get(match.getGuest());
      if (hostSocket && guestSocket) {
        hostSocket.send(JSON.stringify({ message: 'match-found', match: match.getMatchDTO() }));
        guestSocket.send(JSON.stringify({ message: 'match-found', match: match.getMatchDTO() }));
        this.connections.get(match.getGuest())?.close();
        this.connections.get(match.getHost())?.close();
        this.removeConnection(match.getHost());
        this.removeConnection(match.getGuest());
        redis.hset(`matches:${match.getId()}`, 'started', 'true');
        redis.del(`matches:${ghostMatch}`);
      } else {
        // TODO --> implement reconnect logic // Priority 2 NOT MVP
        throw new Error('One of the players is not connected');
      }
    } catch (error) {
      logger.warn('An error occurred on web scoket controller...');
      logger.error(error);
    }
  }
}
