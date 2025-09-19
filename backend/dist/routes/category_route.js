"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = categoryRoutes;
const supabaseClient_1 = require("../utils/supabaseClient");
const response_1 = require("../utils/response");
async function categoryRoutes(fastify) {
    // Get all categories
    fastify.get('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const { data, error } = await supabaseClient_1.supabaseAdmin
            .from('categories')
            .select('*');
        if (error) {
            return reply.status(500).send((0, response_1.fail)(error.message));
        }
        const categories = data;
        return reply.send((0, response_1.success)(categories));
    });
}
