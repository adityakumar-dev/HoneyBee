import { PRODUCT_URL } from "../api_constants";
// Client utility for product API
export interface Product {
  id: string;
  seller_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string[];
  category_id?: string;
  category_name?: string;
}

const PRODUCT_API_URL = PRODUCT_URL;

export async function getProducts(token: string): Promise<Product[]> {
  const resp = await fetch(PRODUCT_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to fetch products');
  return data.data || [];
}

export async function getProductById(id: string, token?: string): Promise<Product> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const resp = await fetch(`${PRODUCT_API_URL}/${id}`, {
    headers
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Product not found');
  return data.data;
}

export async function createProduct(token: string, product: ProductFormData, imageFiles?: File[]): Promise<Product> {
  let body: FormData | string;
  let headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  if (imageFiles && imageFiles.length > 0) {
    // Use FormData for file upload
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'image') {
        if (key === 'image_url' && Array.isArray(value)) {
          value.forEach((url) => formData.append('image_url', url));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    imageFiles.forEach((file) => formData.append('image', file));
    body = formData;
    // Don't set Content-Type header for FormData
  } else {
    // Use JSON for no file
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(product);
  }

  const resp = await fetch(PRODUCT_API_URL, {
    method: 'POST',
    headers,
    body,
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to create product');
  return data.data;
}

export async function updateProduct(token: string, id: string, product: Partial<ProductFormData>): Promise<Product> {
  // Ensure image_url is string[]
  const payload = { ...product, image_url: product.image_url ?? [] };
  const resp = await fetch(`${PRODUCT_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to update product');
  return data.data;
}
