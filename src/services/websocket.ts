import { WebSocket } from 'ws';

// Tipo para los mensajes de chat
interface ChatMessage {
  type: string;
  message: string;
  sender?: string;
}

// Almacén de conexiones activas
const connections: Map<string, WebSocket> = new Map();

export const websocketService = {
  // Registrar una nueva conexión
  registerConnection: (userId: string, socket: WebSocket): void => {
    connections.set(userId, socket);
    
    // Notificar a todos los usuarios que alguien se ha conectado
    websocketService.broadcastSystemMessage(`Usuario ${userId} se ha conectado`);
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
      timestamp: new Date().toISOString()
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
      timestamp: new Date().toISOString()
    };

    const messageStr = JSON.stringify(systemMessage);
    
    for(const socket of connections.values()) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(messageStr);
        }
    }
  },

  // Obtener estadísticas de conexiones
  getStats: () => {
    return {
      activeConnections: connections.size,
      connectionIds: Array.from(connections.keys())
    };
  }
};