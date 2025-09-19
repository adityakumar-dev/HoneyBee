import { supabase } from './supabase';
import { useEffect, useState } from 'react';

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get the current authenticated user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user ?? null, error };
}

// React hook to get and subscribe to the current Supabase user
type SupabaseUser = Awaited<ReturnType<typeof getCurrentUser>>['user'];

export function useSupabaseUser() {
  const [user, setUser] = useState<SupabaseUser>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then(({ user }) => {
      if (mounted) setUser(user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return user;
}
