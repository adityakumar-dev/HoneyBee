import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
    interface FastifyRequest {
        user?: any;
        userRole?: string;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    fastify.decorate(
        'verifyJWT',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    return reply.status(401).send({ error: 'Missing Authorization header' });
                }

                const token = authHeader.replace('Bearer ', '');
                const decoded = jwt.verify(token, env.JWT_SECRET);

                const payload = decoded as { user?: any; metadata?: { role?: string } };
                request.user = payload.user;
                request.userRole = payload.metadata?.role;

            } catch (err) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
        }
    );
});
