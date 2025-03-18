import { WebSocket } from 'ws';
import { type MatchDetails, validateMatchDetails } from '../schemas/zod.js';
import type Match from './game/match/Match.js';
import type MatchMakingService from './lobbies/services/MatchMakingService.js';
import MatchMaking from './lobbies/services/MatchmakingImpl.js';

/**
 * This class is responsible for managing WebSocket connections and handling messages.
 * It also provides matchmaking services for players looking for a match.
 */
export default class WebsocketService {
  // Singleton Instance
  private static instance: WebsocketService;
  public static getInstance(): WebsocketService {
    if (!WebsocketService.instance) WebsocketService.instance = new WebsocketService();
    return WebsocketService.instance;
  }
  private constructor() {
    this.connections = new Map(); // --> This should be a database (Redis)
    this.matchMakingService = MatchMaking.getInstance(this);
  }

  private connections: Map<string, WebSocket>;
  private matchMakingService: MatchMakingService;

  // Registrar una nueva conexión
  public registerConnection(userId: string, socket: WebSocket): void {
    this.connections.set(userId, socket);
    // Notificar a todos los usuarios que alguien se ha conectado
    // websocketService.broadcastSystemMessage(`Usuario ${userId} se ha conectado`);
  }

  // Remover una conexión
  public removeConnection(userId: string): void {
    this.connections.delete(userId);
    // Notificar a todos los usuarios que alguien se ha desconectado
    this.broadcastSystemMessage(`Usuario ${userId} se ha desconectado`);
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

  public async matchMaking(userId: string, message: string | undefined): Promise<void> {
    const match = this.parseData(message); // Mattch Details
    console.info(`Matchmaking from ${userId}: looking for Match: ${JSON.stringify(match)}`);
    // Poner la match en la cola de matchmaking
    this.matchMakingService.searchMatch(userId, match);
  }

  public async notifyMatchFound(match: Match): Promise<void> {
    const hostSocket = this.connections.get(match.getHost());
    const guestSocket = this.connections.get(match.getGuest());
    const matchId = match.getId();

    if (hostSocket && guestSocket) {
      hostSocket.send(JSON.stringify({ message: 'match-found', matchId, match }));
      guestSocket.send(JSON.stringify({ message: 'match-found', matchId, match }));
    } else {
      // TODO --> implement reconnect logic
      throw new Error('One of the players is not connected'); // TODO --> Should handle the exception if a player disconnects
    }
  }

  private parseData(message: string | undefined): MatchDetails {
    if (message === undefined) throw new Error('Message is undefined');
    const matchRaw = JSON.parse(message);
    return validateMatchDetails(matchRaw);
  }
}
