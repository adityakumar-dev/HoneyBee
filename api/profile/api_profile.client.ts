// Client utility for profile API
import type { Profile } from '@/lib/profile';
import { PROFILE_URL } from '../api_constants';
export async function getProfile(token: string) {
  const resp = await fetch(PROFILE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to fetch profile');
  return data;
}

export async function updateProfile(token: string, profile: Partial<Profile>) {
  const resp = await fetch(PROFILE_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to update profile');
  return data;
}

export async function createProfile(token: string, profile: Partial<Profile>) {
  const resp = await fetch(PROFILE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || 'Failed to create profile');
  return data;
}
