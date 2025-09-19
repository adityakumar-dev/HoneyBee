import { useState, useEffect } from 'react';
import { getProducts } from '@/api/product/api_product.client';
import { getCategories as fetchCategoriesApi } from '@/api/category/api_category.client';

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

export interface Category {
  id: string;
  name: string;
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
  image: File[] | null;
  category_name?: string;
}

export function useProducts(token: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProducts(token);
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useCategories(token: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCategoriesApi(token);
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  return { categories, loading, error, refetch: fetchCategories };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}
