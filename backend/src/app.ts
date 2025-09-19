import Fastify from 'fastify';
import { env } from './config/env';
import fastifyMultipart from '@fastify/multipart';

export const buildApp = () => {
  const app = Fastify({ logger: true });
  app.register(import('@fastify/cors'));
  app.register(import('./middleware/auth'));
  app.register(fastifyMultipart, {
  attachFieldsToBody: true, // optional: merges files + fields into req.body
  limits: {
    fileSize: 10 * 1024 * 1024 // optional: 10MB max per file
  }
});

  // healthcheck route
  app.get('/health', async () => ({ status: 'ok' }));

  // Register API routes
  app.register(import('./routes/profile_route'), { prefix: '/profile' });
  app.register(import('./routes/address_route'), { prefix: '/address' });
    app.register(import('./routes/category_route'), { prefix: '/category' });
    app.register(import('./routes/product_route'), { prefix: '/product' });
    app.register(import('./routes/productList_route'), { prefix: '/products' }); 


  return app;
};
