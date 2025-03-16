import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';
import WebsocketService from '../../app/WebSocketServiceImpl.js';

export default class MatchMakingController {
  private websocketService: WebsocketService = WebsocketService.getInstance();
  private static instance: MatchMakingController;
  public static getInstance(): MatchMakingController {
    if (!MatchMakingController.instance) {
      MatchMakingController.instance = new MatchMakingController();
    }
    return MatchMakingController.instance;
  }

  public handleEchoConnection(socket: WebSocket, _request: FastifyRequest) {
    socket.on('message', (message: Buffer) => {
      const messageStr = message.toString();
      socket.send(`Echo: ${messageStr}`);
    });

    socket.on('close', () => {
      // Limpiar recursos cuando la conexión se cierre
    });
  }

  public handleSession(socket: WebSocket, request: FastifyRequest) {
    // Registrar la conexión del usuario en el servicio
    const data = request.query as { userId?: string };
    const userId = data.userId || `user-${Date.now()}`;
    this.websocketService.registerConnection(userId, socket);

    // Enviar mensaje de bienvenida
    socket.send(
      JSON.stringify({
        type: 'system',
        message: `Bienvenido al chat, tu ID es: ${userId}`,
        timestamp: new Date().toISOString(),
      })
    );

    // Manejar los mensajes entrantes
    socket.on('message', (message: Buffer) => {
      try {
        const messageData = JSON.parse(message.toString());
        this.websocketService.broadcastMessage(userId, messageData);
      } catch (error) {
        console.error('Error al procesar mensaje:', error);
        socket.send(
          JSON.stringify({
            type: 'error',
            message: 'Formato de mensaje inválido',
            timestamp: new Date().toISOString(),
          })
        );
      }
    });

    // Limpiar recursos cuando la conexión se cierre
    socket.on('close', () => {
      this.websocketService.removeConnection(userId);
    });
  }
}
