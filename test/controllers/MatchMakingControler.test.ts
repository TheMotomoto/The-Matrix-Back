import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MatchMakingController from '../../src/controllers/websockets/MatchMakingController.js'; 
import WebsocketService from '../../src/app/WebSocketServiceImpl.js';
import { validateString } from '../../src/schemas/zod.js';
import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';

// Mock dependencies
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
    validateString: vi.fn(input => input),
}));

describe('MatchMakingController', () => {
    const mockWebSocketService = WebsocketService.getInstance() as unknown as {
        registerConnection: ReturnType<typeof vi.fn>;
        matchMaking: ReturnType<typeof vi.fn>;
        removeConnection: ReturnType<typeof vi.fn>;
    };
    
    // Definir un tipo para nuestro mock de WebSocket con las funciones mockeadas de vi
    type MockWebSocket = {
        send: ReturnType<typeof vi.fn>;
        on: ReturnType<typeof vi.fn>;
        // Añadir otros métodos según sea necesario
    };
    
    let mockSocket: MockWebSocket;
    let mockRequest: FastifyRequest;
    let messageHandler: ((message: Buffer) => void) | undefined;
    let closeHandler: (() => void) | undefined;
    
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Crear manejadores específicos que podemos almacenar para usarlos después
        messageHandler = undefined;
        closeHandler = undefined;
        
        // Crear un mock más explícito
        mockSocket = {
            send: vi.fn(),
            on: vi.fn((event: string, handler: ((message: Buffer) => void) | (() => void)) => {
                if (event === 'message') {
                    messageHandler = handler as (message: Buffer) => void;
                } else if (event === 'close') {
                    closeHandler = handler as () => void;
                }
                return mockSocket as unknown as WebSocket;
            }),
        };
        
        mockRequest = {
            query: { userId: 'user123', message: 'hello' }
        } as unknown as FastifyRequest;
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
        it('should register connection with validated userId', () => {
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);

            // Assert
            expect(validateString).toHaveBeenCalledWith('user123');
            expect(mockWebSocketService.registerConnection).toHaveBeenCalledWith('user123', mockSocket);
            expect(mockSocket.send).toHaveBeenCalledWith('Connected and looking for a match...');
            expect(mockWebSocketService.matchMaking).toHaveBeenCalledWith('user123', 'hello');
        });

        it('should work when message is not provided', () => {
            // Arrange
            mockRequest.query = { userId: 'user123' };
            
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);

            // Assert
            expect(mockWebSocketService.matchMaking).toHaveBeenCalledWith('user123', undefined);
        });

        it('should set up message event listener that responds accordingly', () => {
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);
            
            // Assert
            expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));
            
            // Simulate message event using our captured handler
            if (messageHandler) {
                messageHandler(Buffer.from('test'));
                expect(mockSocket.send).toHaveBeenCalledWith('Matchmaking in progress...');
            } else {
                throw new Error('Message handler not registered');
            }
        });

        it('should set up close event listener that cleans up resources', () => {
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);
            
            // Assert
            expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
            
            // Simulate close event using our captured handler
            if (closeHandler) {
                closeHandler();
                expect(mockWebSocketService.removeConnection).toHaveBeenCalledWith('user123');
            } else {
                throw new Error('Close handler not registered');
            }
        });
    });
});