import { ADDRESS_URL } from "../api_constants";
// Client utility for address API
export interface Address {
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

const ADDRESS_API_URL = ADDRESS_URL;

export async function getAddresses(token: string): Promise<Address[]> {
  const resp = await fetch(ADDRESS_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to fetch addresses');
  return data.data || [];
}

export async function createAddress(token: string, address: Omit<Address, 'id' | 'profile_id' | 'created_at' | 'updated_at'>): Promise<Address> {
  const resp = await fetch(ADDRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to create address');
  return data.data;
}

export async function updateAddress(token: string, id: string, address: Partial<Omit<Address, 'id' | 'profile_id' | 'created_at'>>): Promise<Address> {
  const resp = await fetch(`${ADDRESS_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to update address');
  return data.data;
}

export async function deleteAddress(token: string, id: string): Promise<void> {
  const resp = await fetch(`${ADDRESS_API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to delete address');
}
