// addressRoutes.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { supabaseAdmin } from '../utils/supabaseClient';
import { success, fail } from '../utils/response';

interface Address {
  id: string;
  profile_id: string;
  type?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  created_at?: string;
  updated_at?: string;
}

interface IdParams {
  id: string;
}

export default async function addressRoutes(fastify: FastifyInstance) {
  // Get all addresses
  fastify.get(
    '/',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const profileId = (request as any).user?.id;
      const { data, error } = await supabaseAdmin
        .from('addresses')
        .select('*')
        .eq('profile_id', profileId);

      if (error) return reply.status(500).send(fail(error.message));
      return reply.send(success(data));
    }
  );

  // Add new address
  fastify.post(
    '/',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const profileId = (request as any).user?.id;
      console.log(request.body);
      console.log(request.user);
      const { type, line1, line2, city, state, country, postal_code } = request.body as Partial<Address>;

      const { data, error } = await supabaseAdmin
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

      if (error) return reply.status(500).send(fail(error.message));
      return reply.code(201).send(success(data));
    }
  );

  // Update address
  fastify.put(
    '/:id',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const profileId = (request as any).user?.id;
      const addressId = request.params.id;
      const { type, line1, line2, city, state, country, postal_code } = request.body as Partial<Address>;

      const { data, error } = await supabaseAdmin
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

      if (error) return reply.status(500).send(fail(error.message));
      return reply.send(success(data));
    }
  );

  // Delete address
  fastify.delete(
    '/:id',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const profileId = (request as any).user?.id;
      const addressId = request.params.id;

      const { error } = await supabaseAdmin
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('profile_id', profileId);

      if (error) return reply.status(500).send(fail(error.message));
      return reply.send(success({ message: 'Address deleted successfully' }));
    }
  );
}
