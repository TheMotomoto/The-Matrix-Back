import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';
import { registerPlugins } from './plugins/index.js';
import { registerRoutes } from './routes/index.js';

// Crear instancia de Fastify con TypeBox
const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  },
}).withTypeProvider<TypeBoxTypeProvider>();
// Registrar plugins
await registerPlugins(server);

// Registrar rutas
await registerRoutes(server);

// Iniciar
const start = async () => {
  try {
    const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
    await server.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Pa cerrarlo
const closeGracefully = async (signal: string) => {
  server.log.info(`\nKilling server ;-; ${signal} I'm dying...\nR.I.P. Server`);
  await server.close();
  process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

// Iniciar el servidor
start();
