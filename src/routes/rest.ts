import type { FastifyInstance } from 'fastify';
import UserController from '../controllers/rest/UserController.js';
const userController = UserController.getInstance();
export async function restRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/users', async (req, res) => {
    await userController.handleCreateUser(req, res);
  });

  fastify.get('/users/:userId', async (req, res) => {
    await userController.handleGetUser(req, res);
  });
}
