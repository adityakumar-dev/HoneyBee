"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.decorate('verifyJWT', async (request, reply) => {
        try {
            console.log('Verifying JWT for request:', request.url);
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                return reply.status(401).send({ error: 'Missing Authorization header' });
            }
            const token = authHeader.replace('Bearer ', '');
            const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            // Attach user info and role to request
            request.user = {
                id: payload.sub,
                email: payload.email,
                ...payload.user_metadata
            };
            request.userRole = payload.app_metadata?.role;
        }
        catch (err) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
    });
});
