import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import PlayerError from '../app/errors/CharacterError.js';
import MatchError from '../app/errors/MatchError.js';
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
    return response.status(500).send({
      statusCode: 500,
      message: 'Something went wrong',
    });
  }

  // An error from customized error class
  if (error instanceof PlayerError) {
    return response.status(500).send({
      statusCode: 500,
      message: 'Something went wrong',
    });
  }

  if (error instanceof MatchError) {
    if (
      error.message === MatchError.MATCH_NOT_FOUND ||
      error.message === MatchError.PLAYER_NOT_FOUND
    ) {
      return response.status(404).send({
        statusCode: 404,
        message: 'Resource not found',
      });
    }

    return response.status(400).send({
      statusCode: 400,
      message: 'Bad request',
    });
  }

  if (error instanceof AppError || error instanceof Error) {
    return response.status(500).send({
      statusCode: 500,
      message: 'Something went wrong',
    });
  }

  return response.status(500).send({
    statusCode: 500,
    message: 'Something went wrong',
  });
};
