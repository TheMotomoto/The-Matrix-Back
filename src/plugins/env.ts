import fastifyEnv from '@fastify/env';
import { config } from 'dotenv';
import type { FastifyInstance } from 'fastify';

config();

const schema = {
  type: 'object',
  required: ['PORT', 'HOST'],
  properties: {
    PORT: {
      type: 'string',
      default: '3000',
    },
    HOST: {
      type: 'string',
      default: '0.0.0.0',
    },
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
    JWT_SECRET: {
      type: 'string',
      default: 'supersecretkey',
    },
    CORS_ORIGIN: {
      type: 'string',
      default: '*',
    },
    LOG_LEVEL: {
      type: 'string',
      default: 'info',
    },
  },
};

export const envOptions = {
  confKey: 'config',
  schema: schema,
  dotenv: true,
  data: process.env,
};

export async function configureEnv(server: FastifyInstance): Promise<void> {
  await server.register(fastifyEnv, envOptions);
}

// Definir tipos importados
export type EnvConfig = {
  PORT: string;
  HOST: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
};

// Extender FastifyInstance para incluir config y poder hacer ---> fastify.config.PORT <---- por ejmplo
declare module 'fastify' {
  interface FastifyInstance {
    config: EnvConfig;
  }
}
