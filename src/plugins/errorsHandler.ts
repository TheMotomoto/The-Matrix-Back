import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import ErrorTemplate from '../app/errors/ErrorTemplate.js';
import { logger } from '../server.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: unknown, _request: FastifyRequest, response: FastifyReply) => {
  // Aqui pal manejo de errores
  logger.warn('An error occurred...');
  logger.error(error);
  if (error instanceof ZodError) {
    return response.status(400).send({
      statusCode: 400,
      message: 'Bad request',
    });
  }

  // An error from customized error class
  if (error instanceof ErrorTemplate) {
    if(error.code === 401 || error.code === 403) return response.status(error.code).send('Unauthorized');
    return response.status(error.code);
  }

  return response.status(500).send({
    statusCode: 500,
    message: 'Something went wrong',
  });
};
