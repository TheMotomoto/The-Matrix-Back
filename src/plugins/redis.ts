import redis from '@fastify/redis';
import type { FastifyInstance } from 'fastify';

export async function configureRedis(server: FastifyInstance): Promise<void> {
  await server.register(redis, {
    url: server.config.REDIS_URL,
  });
}
