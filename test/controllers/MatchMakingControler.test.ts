import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MatchMakingController from '../../src/controllers/websockets/MatchMakingController.js'; 
import WebsocketService from '../../src/app/WebSocketServiceImpl.js';
import { validateString, validateMatchDetails } from '../../src/schemas/zod.js';
import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';

// Mock dependencies
vi.mock('../../src/server.js', () => {
    return {
        logger: {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
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
    validateString: vi.fn(input => input),
    validateMatchDetails: vi.fn(input => input),
}));

vi.mock('../../src/controllers/websockets/WebSocketError.js', () => {
    return {
        default: class WebSocketError extends Error {
            static BAD_WEB_SOCKET_REQUEST = 'Bad WebSocket Request';
            constructor(message: string) {
                super(message);
                this.name = 'WebSocketError';
            }
        }
    };
});

describe('MatchMakingController', () => {
    const mockWebSocketService = WebsocketService.getInstance() as unknown as {
        registerConnection: ReturnType<typeof vi.fn>;
        matchMaking: ReturnType<typeof vi.fn>;
        removeConnection: ReturnType<typeof vi.fn>;
    };
    
    type MockWebSocket = {
        send: ReturnType<typeof vi.fn>;
        on: ReturnType<typeof vi.fn>;
        close: ReturnType<typeof vi.fn>;
    };
    
    let mockSocket: MockWebSocket;
    let mockRequest: FastifyRequest;
    let messageHandler: ((message: Buffer) => void) | undefined;
    let closeHandler: (() => void) | undefined;
    
    const validMatchDetails = { gameMode: 'solo', difficulty: 'easy', map: 'forest' };
    
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Handlers we can store for later use
        messageHandler = undefined;
        closeHandler = undefined;
        
        // Create mock WebSocket
        mockSocket = {
            send: vi.fn(),
            on: vi.fn((event: string, handler: (data?: Buffer | Error) => void) => {
                if (event === 'message') {
                    messageHandler = handler as (message: Buffer) => void;
                } else if (event === 'close') {
                    closeHandler = handler as () => void;
                }
                return mockSocket as unknown as WebSocket;
            }),
            close: vi.fn(),
        };
        
        // Create mock request with valid message JSON
        mockRequest = {
            query: { 
                userId: 'user123', 
                message: JSON.stringify(validMatchDetails)
            }
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
        it('should register connection with validated userId and match details', () => {
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);

            // Assert
            expect(validateString).toHaveBeenCalledWith('user123');
            expect(validateMatchDetails).toHaveBeenCalledWith(validMatchDetails);
            expect(mockWebSocketService.registerConnection).toHaveBeenCalledWith('user123', mockSocket);
            expect(mockSocket.send).toHaveBeenCalledWith('Connected and looking for a match...');
            expect(mockWebSocketService.matchMaking).toHaveBeenCalledWith('user123', validMatchDetails);
        });

        it('should throw error when message is not provided', () => {
            // Arrange
            mockRequest.query = { userId: 'user123' };
            
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);

            // Assert
            expect(mockSocket.send).toHaveBeenCalledWith('Internal server error');
            expect(mockSocket.close).toHaveBeenCalled();
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

        it('should set up error event listener', () => {
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);
            
            // Assert
            expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
        });

        it('should handle JSON parsing errors', () => {
            // Arrange
            mockRequest.query = { 
                userId: 'user123', 
                message: 'invalid-json' 
            };
            
            // Act
            const controller = MatchMakingController.getInstance();
            controller.handleMatchMaking(mockSocket as unknown as WebSocket, mockRequest);

            // Assert
            expect(mockSocket.send).toHaveBeenCalledWith('Internal server error');
            expect(mockSocket.close).toHaveBeenCalled();
        });
    });
});