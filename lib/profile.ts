import { useEffect, useState } from 'react';
import { getProfile } from '@/api/profile/api_profile.client';

export interface Profile {
  user_id: string;
  name?: string;
  status?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export function useProfile(token: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileNull, setProfileNull] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProfile(token)
      .then((json) => {
        if (json.success) {
          setProfile(json.data || null);
        } else {
          setProfile(null);
          setError(json.message || 'Failed to fetch profile');
        }
      })
      .catch((e) => {
        setProfile(null);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { profile, loading, error };
}
