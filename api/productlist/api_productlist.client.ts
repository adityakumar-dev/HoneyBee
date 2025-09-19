import { PRODUCT_LIST_URL } from "../api_constants";

export interface ProductListQuery {
  category_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_at_desc' | 'created_at_asc';
}

export interface ProductListResponse {
  products: Array<{
    id: string;
    seller_id: string;
    category_id?: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    image_url: string[];
    created_at?: string;
    updated_at?: string;
    seller_name?: string;
    category_name?: string;
  }>;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

const PRODUCT_LIST_API_URL = PRODUCT_LIST_URL;

export async function getProductList(token: string, query: ProductListQuery = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const url = `${PRODUCT_LIST_API_URL}${params.toString() ? `?${params.toString()}` : ''}`;

  const resp = await fetch(url, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to fetch products');
  return data.data;
}

export async function getProductsByCategory(token: string, categoryId: string, query: Omit<ProductListQuery, 'category_id'> = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const url = `${PRODUCT_LIST_API_URL}/category/${categoryId}${params.toString() ? `?${params.toString()}` : ''}`;

  const resp = await fetch(url, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to fetch products by category');
  return data.data;
}
