import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { supabaseAdmin } from '../utils/supabaseClient';
import { success, fail } from '../utils/response';

interface Profile {
  user_id: string;
  name?: string;
  role?: string;
  status?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export default async function profileRoutes(fastify: FastifyInstance) {
  // get current profile
  fastify.get(
    '/',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user?.id;
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return reply.status(500).send(fail(error.message));
      }
      return reply.send(success(data));
    }
  );

  // update profile (name, phone, etc.)
  fastify.put(
    '/',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user?.id;
      const { name, phone } = request.body as { name?: string; phone?: string };

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ name, phone, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return reply.status(500).send(fail(error.message));
      }
      return reply.send(success(data));

    }
  );

  // add new profile
  fastify.post(
    '/',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user?.id;
      const { name, phone, role, status } = request.body as Partial<Profile>;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert([
          {
            user_id: userId,
            name,
            phone,
            role,
            status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select('*')
        .single();

      if (error) {
        return reply.status(500).send(fail(error.message));
      }
      return reply.code(201).send(success(data));
    }
  );
}
