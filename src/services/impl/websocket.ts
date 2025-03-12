import { type MatchDetails, validateMatchDetails } from 'src/plugins/zod.js';
import { WebSocket } from 'ws';
import Match from '../game/Match.js';
import type MatchMakingService from '../interfaces/MatchMakingService.js';
import MatchMaking from './Matchmaking.js';
interface ChatMessage {
  type: string;
  message: string;
  sender?: string;
}

// Almacén de conexiones activas // TODO cambiar a una base de datos (Redis)
const connections: Map<string, WebSocket> = new Map();
const matchMakingService: MatchMakingService = MatchMaking.getInstance();

function parseBufferMatch(message: Buffer): MatchDetails {
  const matchRaw = JSON.parse(message.toString());
  const matchDTO = validateMatchDetails(matchRaw);
  return matchDTO;
}

export const websocketService = {
  // Registrar una nueva conexión
  registerConnection: (userId: string, socket: WebSocket): void => {
    connections.set(userId, socket);
    // Notificar a todos los usuarios que alguien se ha conectado
    // websocketService.broadcastSystemMessage(`Usuario ${userId} se ha conectado`);
  },

  // Remover una conexión
  removeConnection: (userId: string): void => {
    connections.delete(userId);
    // Notificar a todos los usuarios que alguien se ha desconectado
    websocketService.broadcastSystemMessage(`Usuario ${userId} se ha desconectado`);
  },

  // Enviar un mensaje a todos los usuarios
  broadcastMessage: (senderId: string, messageData: ChatMessage): void => {
    const formattedMessage = {
      ...messageData,
      sender: senderId,
      timestamp: new Date().toISOString(),
    };

    const messageStr = JSON.stringify(formattedMessage);

    // Enviar a todos los clientes conectados
    connections.forEach((socket, _userId) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
      }
    });
  },

  // Enviar un mensaje del sistema a todos los usuarios
  broadcastSystemMessage: (message: string): void => {
    const systemMessage = {
      type: 'system',
      message,
      timestamp: new Date().toISOString(),
    };

    const messageStr = JSON.stringify(systemMessage);

    for (const socket of connections.values()) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
      }
    }
  },

  // Obtener estadísticas de conexiones
  getStats: () => {
    return {
      activeConnections: connections.size,
      connectionIds: Array.from(connections.keys()),
    };
  },

  async matchMaking(userId: string, message: Buffer): Promise<string> {
    const match = parseBufferMatch(message);
    console.info(`Matchmaking message from ${userId}: looking for Match: ${JSON.stringify(match)}`);
    // Poner la match en la cola de matchmaking
    const matchId: string = await matchMakingService.searchMatch(userId, match);
    return matchId;
  },
};
