import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import MatchMakingController from '../../src/controllers/websockets/MatchMakingController.js';
import WebsocketService from '../../src/app/WebSocketServiceImpl.js';
import { validateString, validateMatchDetails, validateMatchInputDTO } from '../../src/schemas/zod.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { WebSocket } from 'ws';
import { redis } from '../../src/server.js';

vi.mock('../../src/server.js', () => {
  return {
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
    redis: {
      hgetall: vi.fn(),
      hset: vi.fn(),
      expire: vi.fn(),
    },
  };
});

vi.mock('../../src/app/WebSocketServiceImpl.js', () => {
  const mockInstance = {
    registerConnection: vi.fn(),
    matchMaking: vi.fn(),
    removeConnection: vi.fn(),
  };
  return {
    default: {
      getInstance: vi.fn(() => mockInstance),
    },
  };
});

vi.mock('../../src/schemas/zod.js', () => ({
  validateString: vi.fn((input) => input),
  validateMatchDetails: vi.fn((input) => input),
  validateMatchInputDTO: vi.fn((input) => input),
}));

describe('MatchMakingController', () => {
  const mockWebSocketService = WebsocketService.getInstance();
  type MockWebSocket = {
    send: ReturnType<typeof vi.fn>;
    on: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };

  let mockSocket: MockWebSocket;
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;
  let messageHandler: ((message: Buffer) => void) | undefined;
  let closeHandler: (() => void) | undefined;

  const validMatchDetails = {
    id: 'match123',
    host: 'user123',
    guest: null,
    level: 2,
    map: 'desert',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    messageHandler = undefined;
    closeHandler = undefined;

    mockSocket = {
      send: vi.fn(),
      on: vi.fn((event: string, handler: (message: Buffer | Error) => undefined | (() => void)) => {
        if (event === 'message') messageHandler = handler as (message: Buffer) => void;
        if (event === 'close') closeHandler = handler as () => void;
        return mockSocket as unknown as WebSocket;
      }),
      close: vi.fn(),
    };

    mockRequest = {
      params: { matchId: 'user123' },
    } as unknown as FastifyRequest;

    mockReply = {
      send: vi.fn(),
    } as unknown as FastifyReply;

    (redis.hgetall as Mock).mockResolvedValue(validMatchDetails);

  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = MatchMakingController.getInstance();
      const instance2 = MatchMakingController.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('handleMatchMaking', () => {
    it('should register connection, send initial message and setup event listeners', async () => {
      const controller = MatchMakingController.getInstance();
      await controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);
      
      expect(validateString).toHaveBeenCalledWith('user123');
      expect(validateMatchDetails).toHaveBeenCalled();
      expect(mockWebSocketService.registerConnection).toHaveBeenCalledWith('user123', mockSocket);
      expect(mockSocket.send).toHaveBeenCalledWith('Connected and looking for a match...');
      expect(mockWebSocketService.matchMaking).toHaveBeenCalledWith(validMatchDetails);
      expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should handle errors and close socket when exception occurs', async () => {
      (validateString as Mock).mockImplementation(() => { throw new Error('Invalid'); });
      const controller = MatchMakingController.getInstance();
      await controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);
      expect(mockSocket.send).toHaveBeenCalledWith('Internal server error');
      expect(mockSocket.close).toHaveBeenCalled();
    });

    it('should respond with progress message on message event', async () => {
      const controller = MatchMakingController.getInstance();
      await controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);
      if (messageHandler) {
        messageHandler(Buffer.from('any message'));
        expect(mockSocket.send).toHaveBeenCalledWith('Matchmaking in progress...');
      } else {
        throw new Error('Message handler not registered');
      }
    });

    it('should remove connection on close event', async () => {
      const controller = MatchMakingController.getInstance();
      await controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);
      if (closeHandler) {
        closeHandler();
        expect(mockWebSocketService.removeConnection).toHaveBeenCalledWith('user123');
      } else {
        throw new Error('Close handler not registered');
      }
    });
  });

  describe('handleCreateMatch', () => {
    it('should create a match and return a match id', async () => {
      const matchInput = { level: 3, map: 'city' };
      const req = {
        params: { userId: 'user123' },
        body: JSON.stringify(matchInput),
      } as unknown as FastifyRequest;
      const controller = MatchMakingController.getInstance();
      await controller.handleCreateMatch(req, mockReply);
      expect(validateString).toHaveBeenCalledWith('user123');
      expect(validateMatchInputDTO).toHaveBeenCalledWith(JSON.stringify(matchInput));
      expect(redis.hset).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalled();
      const sentArg = (mockReply.send as Mock).mock.calls[0][0];
      expect(typeof sentArg).toBe('string');
      expect(sentArg.length).toBe(8);
    });
  });

  describe('handleGetMatch', () => {
    it('should retrieve the match id from user record and send it in response', async () => {
      (redis.hgetall as Mock).mockResolvedValue({ match: 'match789' });
      const req = {
        params: { userId: 'user123' },
      } as unknown as FastifyRequest;
      const controller = MatchMakingController.getInstance();
      await controller.handleGetMatch(req, mockReply);
      expect(mockReply.send).toHaveBeenCalledWith({ matchId: 'match789' });
    });
  });
});
