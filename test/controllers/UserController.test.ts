import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { FastifyRedis } from '@fastify/redis';
import UserController from '../../src/controllers/rest/UserController.js';
import { v4 as uuidv4 } from 'uuid';
import { validateString } from 'src/schemas/zod.js';
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'fixed-uuid'),
}));
vi.mock('src/schemas/zod.js', () => ({
  validateString: vi.fn((str: string) => str),
}));

describe('UserController', () => {
  let redis: FastifyRedis;
  let req: FastifyRequest;
  let res: FastifyReply;
  let controller: UserController;

  beforeEach(() => {
    vi.clearAllMocks();
    
    redis = {
      hset: vi.fn(() => Promise.resolve()),
      hgetall: vi.fn(() => Promise.resolve({ id: 'fixed-uuid', name: 'Test User' })),
    } as unknown as FastifyRedis;

    req = {
      params: { userId: 'fixed-uuid' },
    } as unknown as FastifyRequest;

    res = {
      send: vi.fn(),
    } as unknown as FastifyReply;

    controller = UserController.getInstance();
  });

  describe('handleCreateUser', () => {
    it('should create a user and send the generated userId', async () => {
      await controller.handleCreateUser(redis, req, res);

      expect(uuidv4).toHaveBeenCalled();

      expect(redis.hset).toHaveBeenCalledWith('users:fixed-uuid', 'id', 'fixed-uuid');

      expect(res.send).toHaveBeenCalledWith({ userId: 'fixed-uuid' });
    });
  });

  describe('handleGetUser', () => {
    it('should validate the userId, retrieve the user from Redis and send the user object', async () => {
      await controller.handleGetUser(redis, req, res);

      expect(validateString).toHaveBeenCalledWith('fixed-uuid');

      expect(redis.hgetall).toHaveBeenCalledWith('users:fixed-uuid');

      expect(res.send).toHaveBeenCalledWith({ id: 'fixed-uuid', name: 'Test User' });
    });
  });

  describe('singleton', () => {
    it('should always return the same instance', () => {
      const instance1 = UserController.getInstance();
      const instance2 = UserController.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});
