import type { FastifyReply, FastifyRequest } from 'fastify';
import { healthService } from '../services/hello.js';

export const hello = {
  check: async (_request: FastifyRequest, reply: FastifyReply) => {
    const health = await healthService.getStatus();
    return reply.code(200).send(health);
  },
};
