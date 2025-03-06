import type { FastifyInstance } from 'fastify';
import { Type } from '@fastify/type-provider-typebox';
import { hello } from '../controllers/hello.js';

export async function helloRoutes(fastify: FastifyInstance): Promise<void> {
  const HelloResponse = Type.Object({
    status: Type.String(),
    timestamp: Type.String(),
  });

  fastify.get('/', {
    schema: {
      response: {
        200: HelloResponse,
      },
    },
    handler: hello.check,
  });
}