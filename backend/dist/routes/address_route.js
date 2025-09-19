"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addressRoutes;
const supabaseClient_1 = require("../utils/supabaseClient");
const response_1 = require("../utils/response");
async function addressRoutes(fastify) {
    // Get all addresses
    fastify.get('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const profileId = request.user?.id;
        const { data, error } = await supabaseClient_1.supabaseAdmin
            .from('addresses')
            .select('*')
            .eq('profile_id', profileId);
        if (error)
            return reply.status(500).send((0, response_1.fail)(error.message));
        return reply.send((0, response_1.success)(data));
    });
    // Add new address
    fastify.post('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const profileId = request.user?.id;
        console.log(request.body);
        console.log(request.user);
        const { type, line1, line2, city, state, country, postal_code } = request.body;
        const { data, error } = await supabaseClient_1.supabaseAdmin
            .from('addresses')
            .insert([
            {
                profile_id: profileId,
                type,
                line1,
                line2,
                city,
                state,
                country,
                postal_code,
            },
        ])
            .select('*')
            .single();
        if (error)
            return reply.status(500).send((0, response_1.fail)(error.message));
        return reply.code(201).send((0, response_1.success)(data));
    });
    // Update address
    fastify.put('/:id', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const profileId = request.user?.id;
        const addressId = request.params.id;
        const { type, line1, line2, city, state, country, postal_code } = request.body;
        const { data, error } = await supabaseClient_1.supabaseAdmin
            .from('addresses')
            .update({
            type,
            line1,
            line2,
            city,
            state,
            country,
            postal_code,
            updated_at: new Date().toISOString(),
        })
            .eq('id', addressId)
            .eq('profile_id', profileId)
            .select('*')
            .maybeSingle();
        if (error)
            return reply.status(500).send((0, response_1.fail)(error.message));
        return reply.send((0, response_1.success)(data));
    });
    // Delete address
    fastify.delete('/:id', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const profileId = request.user?.id;
        const addressId = request.params.id;
        const { error } = await supabaseClient_1.supabaseAdmin
            .from('addresses')
            .delete()
            .eq('id', addressId)
            .eq('profile_id', profileId);
        if (error)
            return reply.status(500).send((0, response_1.fail)(error.message));
        return reply.send((0, response_1.success)({ message: 'Address deleted successfully' }));
    });
}
