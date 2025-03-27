import type { FastifyRedis } from '@fastify/redis';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { validateString } from '../../schemas/zod.js';
import { redis } from '../../server.js';
export default class UserController {
  // Singleton
  private static instance: UserController;
  private constructor() {}
  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public async handleCreateUser(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    const userId: string = uuidv4();
    await redis.hset(`users:${userId}`, 'id', userId);
    await redis.expire(`users:${userId}`, 2 * 60 * 60);
    return res.send({ userId });
  }

  public async handleGetUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { userId } = req.params as { userId: string };
    const parsedId = validateString(userId);
    const user = await redis.hgetall(`users:${parsedId}`);
    return res.send(user);
  }

  public async handleGetUsers(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    const users = await redis.keys('users:*');
    const usersData = await Promise.all(
      users.map(async (key) => {
        return await redis.hgetall(key);
      })
    );

    return res.send(usersData);
  }
}
