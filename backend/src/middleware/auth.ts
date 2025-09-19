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
                console.log('Verifying JWT for request:', request.url);
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    return reply.status(401).send({ error: 'Missing Authorization header' });
                }

                const token = authHeader.replace('Bearer ', '');

                                    const payload = jwt.verify(token, env.JWT_SECRET) as {
                                        sub: string;
                                        email?: string;
                                        user_metadata?: Record<string, any>;
                                        app_metadata?: Record<string, any>;
                                        [key: string]: any;
                                    };

                                    // Attach user info and role to request
                                    request.user = {
                                        id: payload.sub,
                                        email: payload.email,
                                        ...payload.user_metadata
                                    };
                                    request.userRole = payload.app_metadata?.role;

            } catch (err) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
        }
    );
});
