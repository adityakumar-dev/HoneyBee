import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { supabaseAdmin } from '../utils/supabaseClient';
import { success, fail } from '../utils/response';
import { Category } from '../utils/helpers/product_helper';

export default async function categoryRoutes(fastify: FastifyInstance) {
  // Get all categories
  fastify.get(
    '/',
    { preHandler: (fastify as any).verifyJWT },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*');
      if (error) {
        return reply.status(500).send(fail(error.message));
      }
      const categories = data as Category[];
      return reply.send(success(categories));
    }
  );
}
