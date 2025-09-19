import { CATEGORY_URL } from "../api_constants";
// Client utility for category API
export interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

const CATEGORY_API_URL = CATEGORY_URL;

export async function getCategories(token: string): Promise<Category[]> {
  const resp = await fetch(CATEGORY_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to fetch categories');
  return data.data || [];
}
