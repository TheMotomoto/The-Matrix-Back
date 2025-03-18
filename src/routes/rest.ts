import type { FastifyInstance } from 'fastify';
import UserController from '../controllers/rest/UserController.js';
const userController = UserController.getInstance();
export async function restRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/users', async (req, res) => {
    const { redis } = fastify;
    await userController.handleCreateUser(redis, req, res);
  });

  fastify.get('/users/:userId', async (req, res) => {
    const { redis } = fastify;
    await userController.handleGetUser(redis, req, res);
  });
}
