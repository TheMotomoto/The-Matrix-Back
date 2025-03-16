import type { FastifyInstance } from 'fastify';

export async function restRoutes(fastify: FastifyInstance): Promise<void> {
  // GET Example
  fastify.get('/', (_req, res) => {
    res.send({ hello: 'world' });
  });
}
