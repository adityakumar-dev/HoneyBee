import { useState, useEffect } from 'react';
import { getAddresses } from '@/api/address/api_address.client';
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

export const ADDRESS_TYPES = ['home', 'work', 'other'] as const;
export type AddressType = typeof ADDRESS_TYPES[number];

export function useAddresses(token: string | null) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      getAddresses(token).then(addresses => {
        console.log('Fetched addresses:', addresses);
        setAddresses(addresses || []);
      }).catch(err => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  return { addresses, loading, error, refetch: fetchAddresses };
}

export function formatAddress(address: Address): string {
  const parts = [];
  if (address.line1) parts.push(address.line1);
  if (address.line2) parts.push(address.line2);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postal_code) parts.push(address.postal_code);
  if (address.country) parts.push(address.country);
  return parts.join(', ');
}
