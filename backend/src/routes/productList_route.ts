import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { supabaseAdmin } from '../utils/supabaseClient';
import { success, fail } from '../utils/response';
import { parseSupabaseUrl } from '../services/storage';
import { Product } from '../utils/helpers/product_helper';

interface ProductQueryParams {
  category_id?: string;
  search?: string;
  limit?: string;
  offset?: string;
  min_price?: string;
  max_price?: string;
  sort_by?:
    | 'price_asc'
    | 'price_desc'
    | 'name_asc'
    | 'name_desc'
    | 'created_at_desc'
    | 'created_at_asc';
}

interface ProductWithSignedUrls extends Omit<Product, 'image_url'> {
  image_url: string[];
  seller_name?: string;
  category_name?: string;
}

// ---- Helper: generate signed URLs for image arrays ----
async function createSignedUrls(imageUrls: string[]): Promise<string[]> {
  return (
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        try {
          const { bucketName, filePath } = parseSupabaseUrl(imageUrl);
          const { data: signedUrlData, error: signedUrlError } =
            await supabaseAdmin.storage
              .from(bucketName)
              .createSignedUrl(filePath, 60 * 60); // 1h validity

          if (signedUrlError) {
            console.error('Signed URL error:', signedUrlError);
            return null;
          }
          return signedUrlData?.signedUrl || null;
        } catch (e) {
          console.error('Error parsing image URL:', e);
          return null;
        }
      })
    )
  ).filter((u): u is string => Boolean(u));
}

// ---- Helper: map DB row to ProductWithSignedUrls ----
async function mapProductRow(product: any): Promise<ProductWithSignedUrls> {
  const signedImageUrls =
    product.image_url && Array.isArray(product.image_url)
      ? await createSignedUrls(product.image_url)
      : [];

  return {
    id: product.id,
    seller_id: product.seller_id,
    category_id: product.category_id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image_url: signedImageUrls,
    created_at: product.created_at,
    updated_at: product.updated_at,
    // Fallback if joins not present because of select(*)
    seller_name:
      product.profiles?.display_name ||
      product.profiles?.username ||
      'Unknown Seller',
    category_name: product.categories?.name || 'Uncategorized',
  };
}

// ---- Main Routes ----
export default async function productListRoutes(fastify: FastifyInstance) {
  // ----- GET all products -----
  fastify.get(
    '/',
    { preHandler: (fastify as any).verifyJWT },
    async (
      request: FastifyRequest<{ Querystring: ProductQueryParams }>,
      reply: FastifyReply
    ) => {
      try {
        const {
          category_id,
          search,
          limit = '20',
          offset = '0',
          min_price,
          max_price,
          sort_by = 'created_at_desc',
        } = request.query;

        let query = supabaseAdmin.from('products').select('*').gt('stock', 0);

        // filters
        if (category_id) query = query.eq('category_id', category_id);
        if (search)
          query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%`
          );
        if (min_price) query = query.gte('price', parseFloat(min_price));
        if (max_price) query = query.lte('price', parseFloat(max_price));

        // sorting
        switch (sort_by) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'name_asc':
            query = query.order('name', { ascending: true });
            break;
          case 'name_desc':
            query = query.order('name', { ascending: false });
            break;
          case 'created_at_asc':
            query = query.order('created_at', { ascending: true });
            break;
          case 'created_at_desc':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        // pagination
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);
        query = query.range(offsetNum, offsetNum + limitNum - 1);

        const { data, error } = await query;
        if (error) throw error;

        const productsWithSignedUrls = await Promise.all(
          (data as any[]).map(mapProductRow)
        );
        console.log(productsWithSignedUrls);
        return reply.send(
          success({
            products: productsWithSignedUrls,
            pagination: {
              limit: limitNum,
              offset: offsetNum,
              total: productsWithSignedUrls.length,
            },
          })
        );
      } catch (err: any) {
        console.error('Error fetching products for ecommerce:', err);
        return reply
          .status(500)
          .send(fail(err.message || 'Error fetching products'));
      }
    }
  );

  // ----- GET single product by ID -----
  fastify.get(
    '/:id',
    { preHandler: (fastify as any).verifyJWT },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;

        const { data, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116')
            return reply.status(404).send(fail('Product not found'));
          throw error;
        }

        const productWithSignedUrls = await mapProductRow(data);
       

        return reply.send(success(productWithSignedUrls));
      } catch (err: any) {
        console.error('Error fetching product:', err);
        return reply
          .status(500)
          .send(fail(err.message || 'Error fetching product'));
      }
    }
  );

  // ----- GET products by category -----
  fastify.get(
    '/category/:category_id',
    async (
      request: FastifyRequest<{
        Params: { category_id: string };
        Querystring: Omit<ProductQueryParams, 'category_id'>;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { category_id } = request.params;
        const {
          search,
          limit = '20',
          offset = '0',
          min_price,
          max_price,
          sort_by = 'created_at_desc',
        } = request.query;

        let query = supabaseAdmin
          .from('products')
          .select('*')
          .eq('category_id', category_id)
          .gt('stock', 0);

        // filters
        if (search)
          query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%`
          );
        if (min_price) query = query.gte('price', parseFloat(min_price));
        if (max_price) query = query.lte('price', parseFloat(max_price));

        // sorting
        switch (sort_by) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'name_asc':
            query = query.order('name', { ascending: true });
            break;
          case 'name_desc':
            query = query.order('name', { ascending: false });
            break;
          case 'created_at_asc':
            query = query.order('created_at', { ascending: true });
            break;
          case 'created_at_desc':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        // pagination
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);
        query = query.range(offsetNum, offsetNum + limitNum - 1);

        const { data, error } = await query;
        if (error) throw error;

        const productsWithSignedUrls = await Promise.all(
          (data as any[]).map(mapProductRow)
        );

        return reply.send(
          success({
            products: productsWithSignedUrls,
            category_id,
            pagination: {
              limit: limitNum,
              offset: offsetNum,
              total: productsWithSignedUrls.length,
            },
          })
        );
      } catch (err: any) {
        console.error('Error fetching products by category:', err);
        return reply
          .status(500)
          .send(fail(err.message || 'Error fetching products by category'));
      }
    }
  );
}
