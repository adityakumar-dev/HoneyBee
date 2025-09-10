import Fastify from 'fastify';
import { env } from './config/env';

export const buildApp = () => {
  const app = Fastify({ logger: true });
  app.register(import('@fastify/cors'))
  app.register(import('./middleware/auth')); 

  // healthcheck route
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
};
