"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = productListRoutes;
const supabaseClient_1 = require("../utils/supabaseClient");
const response_1 = require("../utils/response");
const storage_1 = require("../services/storage");
async function productListRoutes(fastify) {
    // Get all products for ecommerce (public access)
    fastify.get('/', async (request, reply) => {
        try {
            const { category_id, search, limit = '20', offset = '0', min_price, max_price, sort_by = 'created_at_desc' } = request.query;
            let query = supabaseClient_1.supabaseAdmin
                .from('products')
                .select(`
            id,
            seller_id,
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
            created_at,
            updated_at,
            profiles!products_seller_id_fkey (
              username,
              display_name
            ),
            categories!products_category_id_fkey (
              name
            )
          `)
                .gt('stock', 0); // Only show products in stock
            // Apply filters
            if (category_id) {
                query = query.eq('category_id', category_id);
            }
            if (search) {
                query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
            }
            if (min_price) {
                query = query.gte('price', parseFloat(min_price));
            }
            if (max_price) {
                query = query.lte('price', parseFloat(max_price));
            }
            // Apply sorting
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
            // Apply pagination
            const limitNum = parseInt(limit, 10);
            const offsetNum = parseInt(offset, 10);
            query = query.range(offsetNum, offsetNum + limitNum - 1);
            const { data, error } = await query;
            if (error)
                throw error;
            // Generate signed URLs for all images
            const productsWithSignedUrls = await Promise.all(data.map(async (product) => {
                let signedImageUrls = [];
                if (product.image_url && Array.isArray(product.image_url)) {
                    signedImageUrls = await Promise.all(product.image_url.map(async (imageUrl) => {
                        try {
                            const parsed = (0, storage_1.parseSupabaseUrl)(imageUrl);
                            const { bucketName, filePath } = parsed;
                            const { data: signedUrlData, error: signedUrlError } = await supabaseClient_1.supabaseAdmin
                                .storage
                                .from(bucketName)
                                .createSignedUrl(filePath, 60 * 60); // 1 hour validity
                            if (signedUrlError) {
                                console.error('Error creating signed URL:', signedUrlError);
                                return null;
                            }
                            return signedUrlData?.signedUrl || null;
                        }
                        catch (e) {
                            console.error('Error parsing image URL:', e);
                            return null;
                        }
                    }));
                    // Filter out null values
                    signedImageUrls = signedImageUrls.filter(Boolean);
                }
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
                    seller_name: product.profiles?.display_name || product.profiles?.username || 'Unknown Seller',
                    category_name: product.categories?.name || 'Uncategorized'
                };
            }));
            return reply.send((0, response_1.success)({
                products: productsWithSignedUrls,
                pagination: {
                    limit: limitNum,
                    offset: offsetNum,
                    total: productsWithSignedUrls.length
                }
            }));
        }
        catch (err) {
            console.error('Error fetching products for ecommerce:', err);
            return reply.status(500).send((0, response_1.fail)(err.message || 'Error fetching products'));
        }
    });
    // Get single product by ID (public access)
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const { data, error } = await supabaseClient_1.supabaseAdmin
                .from('products')
                .select(`
            id,
            seller_id,
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
            created_at,
            updated_at,
            profiles!products_seller_id_fkey (
              username,
              display_name,
              avatar_url
            ),
            categories!products_category_id_fkey (
              name
            )
          `)
                .eq('id', id)
                .gt('stock', 0) // Only show if in stock
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return reply.status(404).send((0, response_1.fail)('Product not found'));
                }
                throw error;
            }
            // Generate signed URLs for images
            let signedImageUrls = [];
            if (data.image_url && Array.isArray(data.image_url)) {
                const signedUrlResults = await Promise.all(data.image_url.map(async (imageUrl) => {
                    try {
                        const parsed = (0, storage_1.parseSupabaseUrl)(imageUrl);
                        const { bucketName, filePath } = parsed;
                        const { data: signedUrlData, error: signedUrlError } = await supabaseClient_1.supabaseAdmin
                            .storage
                            .from(bucketName)
                            .createSignedUrl(filePath, 60 * 60); // 1 hour validity
                        if (signedUrlError) {
                            console.error('Error creating signed URL:', signedUrlError);
                            return null;
                        }
                        return signedUrlData?.signedUrl || null;
                    }
                    catch (e) {
                        console.error('Error parsing image URL:', e);
                        return null;
                    }
                }));
                // Filter out null values
                signedImageUrls = signedUrlResults.filter((url) => url !== null);
            }
            const productWithSignedUrls = {
                id: data.id,
                seller_id: data.seller_id,
                category_id: data.category_id,
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                image_url: signedImageUrls,
                created_at: data.created_at,
                updated_at: data.updated_at,
                seller_name: data.profiles?.display_name || data.profiles?.username || 'Unknown Seller',
                category_name: data.categories?.name || 'Uncategorized'
            };
            return reply.send((0, response_1.success)(productWithSignedUrls));
        }
        catch (err) {
            console.error('Error fetching product:', err);
            return reply.status(500).send((0, response_1.fail)(err.message || 'Error fetching product'));
        }
    });
    // Get products by category (public access)
    fastify.get('/category/:category_id', async (request, reply) => {
        try {
            const { category_id } = request.params;
            const { search, limit = '20', offset = '0', min_price, max_price, sort_by = 'created_at_desc' } = request.query;
            let query = supabaseClient_1.supabaseAdmin
                .from('products')
                .select(`
            id,
            seller_id,
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
            created_at,
            updated_at,
            profiles!products_seller_id_fkey (
              username,
              display_name
            ),
            categories!products_category_id_fkey (
              name
            )
          `)
                .eq('category_id', category_id)
                .gt('stock', 0);
            // Apply additional filters
            if (search) {
                query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
            }
            if (min_price) {
                query = query.gte('price', parseFloat(min_price));
            }
            if (max_price) {
                query = query.lte('price', parseFloat(max_price));
            }
            // Apply sorting
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
            // Apply pagination
            const limitNum = parseInt(limit, 10);
            const offsetNum = parseInt(offset, 10);
            query = query.range(offsetNum, offsetNum + limitNum - 1);
            const { data, error } = await query;
            if (error)
                throw error;
            // Generate signed URLs for all images
            const productsWithSignedUrls = await Promise.all(data.map(async (product) => {
                let signedImageUrls = [];
                if (product.image_url && Array.isArray(product.image_url)) {
                    signedImageUrls = await Promise.all(product.image_url.map(async (imageUrl) => {
                        try {
                            const parsed = (0, storage_1.parseSupabaseUrl)(imageUrl);
                            const { bucketName, filePath } = parsed;
                            const { data: signedUrlData, error: signedUrlError } = await supabaseClient_1.supabaseAdmin
                                .storage
                                .from(bucketName)
                                .createSignedUrl(filePath, 60 * 60);
                            if (signedUrlError) {
                                console.error('Error creating signed URL:', signedUrlError);
                                return null;
                            }
                            return signedUrlData?.signedUrl || null;
                        }
                        catch (e) {
                            console.error('Error parsing image URL:', e);
                            return null;
                        }
                    }));
                    signedImageUrls = signedImageUrls.filter(Boolean);
                }
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
                    seller_name: product.profiles?.display_name || product.profiles?.username || 'Unknown Seller',
                    category_name: product.categories?.name || 'Uncategorized'
                };
            }));
            return reply.send((0, response_1.success)({
                products: productsWithSignedUrls,
                category_id,
                pagination: {
                    limit: limitNum,
                    offset: offsetNum,
                    total: productsWithSignedUrls.length
                }
            }));
        }
        catch (err) {
            console.error('Error fetching products by category:', err);
            return reply.status(500).send((0, response_1.fail)(err.message || 'Error fetching products by category'));
        }
    });
}
