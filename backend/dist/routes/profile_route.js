"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = profileRoutes;
const supabaseClient_1 = require("../utils/supabaseClient");
const response_1 = require("../utils/response");
async function profileRoutes(fastify) {
    // get current profile
    fastify.get('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const userId = request.user?.id;
        console.log(request.user);
        const { data, error } = await supabaseClient_1.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) {
            console.log(error);
            return reply.status(500).send((0, response_1.fail)(error.message));
        }
        return reply.send((0, response_1.success)(data));
    });
    // update profile (name, phone, etc.)
    fastify.put('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const userId = request.user?.id;
        const { name, phone } = request.body;
        const { data, error } = await supabaseClient_1.supabaseAdmin
            .from('profiles')
            .update({ name, phone, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .select('*')
            .single();
        if (error) {
            return reply.status(500).send((0, response_1.fail)(error.message));
        }
        return reply.send((0, response_1.success)(data));
    });
    // add new profile
    fastify.post('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const userId = request.user?.id;
        const { name, phone } = request.body;
        const status = 'active';
        console.log(request.body);
        console.log(request.user);
        const { data, error } = await supabaseClient_1.supabaseAdmin
            .from('profiles')
            .insert([
            {
                user_id: userId,
                name,
                phone,
                status,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ])
            .select('*')
            .single();
        if (error) {
            return reply.status(500).send((0, response_1.fail)(error.message));
        }
        return reply.code(201).send((0, response_1.success)(data));
    });
}
