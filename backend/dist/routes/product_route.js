"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = productRoutes;
const supabaseClient_1 = require("../utils/supabaseClient");
const response_1 = require("../utils/response");
const storage_1 = require("../services/storage");
async function productRoutes(fastify) {
    // Create product
    fastify.post('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const sellerId = request.user?.id;
        if (!sellerId) {
            return reply.status(401).send((0, response_1.fail)('Unauthorized: Missing seller ID'));
        }
        // Support both JSON and multipart/form-data
        let name, description, price, stock, image_url = [], category_id, category_name, imageFiles = [];
        if (request.isMultipart()) {
            // Extract fields from multipart
            const body = request.body;
            name = body.name?.value;
            description = body.description?.value;
            price = Number(body.price?.value);
            stock = body.stock?.value ? Number(body.stock.value) : 0;
            category_id = body.category_id?.value;
            category_name = body.category_name?.value;
            // Handle existing image URLs
            if (body.image_url && Array.isArray(body.image_url)) {
                image_url = body.image_url.map((f) => f.value).filter(Boolean);
            }
            else if (body.image_url?.value) {
                image_url = [body.image_url.value];
            }
            // Handle uploaded files - Fastify multipart structure
            if (body.image) {
                if (Array.isArray(body.image)) {
                    // Multiple files
                    imageFiles = body.image;
                }
                else {
                    // Single file
                    imageFiles = [body.image];
                }
            }
        }
        else {
            // JSON body
            const b = request.body;
            name = b.name;
            description = b.description;
            price = b.price;
            stock = b.stock ?? 0;
            image_url = b.image_url ?? [];
            category_id = b.category_id;
            category_name = b.category_name;
            imageFiles = b.image ?? [];
        }
        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return reply.status(400).send((0, response_1.fail)('Product name is required'));
        }
        if (typeof price !== 'number' || price < 0) {
            return reply.status(400).send((0, response_1.fail)('Valid price is required'));
        }
        try {
            // 1️⃣ Handle category
            let finalCategoryId = category_id;
            if (!finalCategoryId && category_name) {
                const { data: category, error: catErr } = await supabaseClient_1.supabaseAdmin
                    .from('categories')
                    .insert([{ name: category_name }])
                    .select('*')
                    .single();
                if (catErr) {
                    if (catErr.code === '23505') {
                        const { data: existingCategory, error: fetchErr } = await supabaseClient_1.supabaseAdmin
                            .from('categories')
                            .select('*')
                            .eq('name', category_name)
                            .single();
                        if (fetchErr)
                            throw fetchErr;
                        finalCategoryId = existingCategory.id;
                    }
                    else
                        throw catErr;
                }
                else
                    finalCategoryId = category.id;
            }
            // 2️⃣ Handle image upload (array)
            let finalImageUrls = image_url ?? [];
            if (imageFiles && imageFiles.length > 0) {
                console.log('Processing files:', imageFiles.map(f => ({
                    filename: f.filename,
                    mimetype: f.mimetype,
                    hasBuffer: !!f.buffer,
                    hasStream: !!f.stream,
                    fieldname: f.fieldname
                })));
                const uploaded = await Promise.all(imageFiles.map(async (file) => {
                    // Ensure we have the file buffer ready
                    if (!file.buffer && file.stream) {
                        // Read stream into buffer if needed
                        const chunks = [];
                        for await (const chunk of file.stream) {
                            chunks.push(Buffer.from(chunk));
                        }
                        file.buffer = Buffer.concat(chunks);
                    }
                    return (0, storage_1.uploadImageToStorage)(file);
                }));
                finalImageUrls = [...finalImageUrls, ...uploaded];
            }
            // 3️⃣ Insert product
            const { data, error } = await supabaseClient_1.supabaseAdmin
                .from('products')
                .insert([
                {
                    seller_id: sellerId,
                    category_id: finalCategoryId,
                    name,
                    description,
                    price,
                    stock,
                    image_url: finalImageUrls ?? [], // now TEXT[] column
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
                .select('*')
                .single();
            if (error)
                throw error;
            return reply.code(201).send((0, response_1.success)(data));
        }
        catch (err) {
            console.error(err);
            return reply
                .status(500)
                .send((0, response_1.fail)(err.message || 'Error adding product'));
        }
    });
    // Get all seller products
    fastify.get('/', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        try {
            const sellerId = request.user?.id;
            const { data, error } = await supabaseClient_1.supabaseAdmin
                .from('products')
                .select('*')
                .eq('seller_id', sellerId);
            if (error)
                throw error;
            // Generate signed URLs for each product's images individually
            const formatted = await Promise.all(data.map(async (p) => {
                let productImageUrls = [];
                if (p.image_url && p.image_url.length > 0) {
                    // Generate signed URLs for this specific product's images
                    const signedUrls = await Promise.all(p.image_url.map(async (bucketUrl) => {
                        try {
                            const parsed = (0, storage_1.parseSupabaseUrl)(bucketUrl);
                            const { bucketName, filePath } = parsed;
                            const { data: signedUrlData, error: signedUrlError } = await supabaseClient_1.supabaseAdmin
                                .storage
                                .from(bucketName)
                                .createSignedUrl(filePath, 60 * 60);
                            if (signedUrlError) {
                                console.error('Signed URL error for', bucketUrl, ':', signedUrlError);
                                return null;
                            }
                            return signedUrlData?.signedUrl || null;
                        }
                        catch (e) {
                            console.error('Error processing URL', bucketUrl, ':', e.message);
                            return null;
                        }
                    }));
                    productImageUrls = signedUrls.filter(url => url !== null);
                }
                return {
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    stock: p.stock,
                    image_url: productImageUrls,
                    category_id: p.category_id,
                    created_at: p.created_at,
                    updated_at: p.updated_at,
                };
            }));
            // Optionally, you can include allImageUrls in the response if needed
            // return reply.send(success({ products: formatted, allImageUrls }));
            return reply.send((0, response_1.success)(formatted));
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send((0, response_1.fail)(err.message || 'Error fetching products'));
        }
    });
    // Get single product by ID (public route)
    fastify.get('/:id', async (request, reply) => {
        try {
            const productId = request.params.id;
            const { data, error } = await supabaseClient_1.supabaseAdmin
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();
            if (error || !data) {
                return reply.status(404).send((0, response_1.fail)('Product not found'));
            }
            const product = data;
            let productImageUrls = [];
            if (product.image_url && product.image_url.length > 0) {
                // Generate signed URLs for this product's images
                const signedUrls = await Promise.all(product.image_url.map(async (bucketUrl) => {
                    try {
                        const parsed = (0, storage_1.parseSupabaseUrl)(bucketUrl);
                        const { bucketName, filePath } = parsed;
                        const { data: signedUrlData, error: signedUrlError } = await supabaseClient_1.supabaseAdmin
                            .storage
                            .from(bucketName)
                            .createSignedUrl(filePath, 60 * 60);
                        if (signedUrlError) {
                            console.error('Signed URL error for', bucketUrl, ':', signedUrlError);
                            return null;
                        }
                        return signedUrlData?.signedUrl || null;
                    }
                    catch (e) {
                        console.error('Error processing URL', bucketUrl, ':', e.message);
                        return null;
                    }
                }));
                productImageUrls = signedUrls.filter(url => url !== null);
            }
            const formattedProduct = {
                id: product.id,
                seller_id: product.seller_id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                image_url: productImageUrls,
                category_id: product.category_id,
                created_at: product.created_at,
                updated_at: product.updated_at,
            };
            return reply.send((0, response_1.success)(formattedProduct));
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send((0, response_1.fail)(err.message || 'Error fetching product'));
        }
    });
    // Update product
    fastify.put('/:id', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const sellerId = request.user?.id;
        const productId = request.params.id;
        const { name, description, price, stock, image_url, category_id } = request.body;
        try {
            const { data, error } = await supabaseClient_1.supabaseAdmin
                .from('products')
                .update({
                name,
                description,
                price,
                stock,
                image_url, // TEXT[] update
                category_id,
                updated_at: new Date().toISOString(),
            })
                .eq('id', productId)
                .eq('seller_id', sellerId)
                .select('*')
                .single();
            if (error)
                throw error;
            return reply.send((0, response_1.success)(data));
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send((0, response_1.fail)(err.message || 'Error updating product'));
        }
    });
    fastify.delete('/:id', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const sellerId = request.user?.id;
        const productId = request.params.id;
        try {
            const { data, error } = await supabaseClient_1.supabaseAdmin
                .from('products')
                .delete()
                .eq('id', productId)
                .eq('seller_id', sellerId)
                .select('*')
                .single();
            if (error)
                throw error;
            return reply.send((0, response_1.success)(data));
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send((0, response_1.fail)(err.message || 'Error deleting product'));
        }
    });
}
