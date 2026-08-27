import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AdminProfile {
  id: string;
  user_id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextProps {
  user: User | null;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch the admin profile
  const fetchAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching admin profile:', error);
        setAdminProfile(null);
      } else {
        setAdminProfile(data as AdminProfile);
      }
    } catch (err) {
      console.error('Unexpected error fetching admin profile:', err);
      setAdminProfile(null);
    }
  };

  // Handle session initialization and auth state changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        if (mounted) setUser(session.user);
        await fetchAdminProfile(session.user.id);
      } else {
        if (mounted) {
          setUser(null);
          setAdminProfile(null);
        }
      }
      if (mounted) setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (mounted) setUser(session.user);
        // Only re-fetch if it's a new login to avoid redundant network calls
        if (event === 'SIGNED_IN') {
          await fetchAdminProfile(session.user.id);
        }
      } else {
        if (mounted) {
          setUser(null);
          setAdminProfile(null);
        }
      }
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange handles the rest
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setIsLoading(false);
      throw error;
    }
    // onAuthStateChange handles clearing the state
  };

  return (
    <AuthContext.Provider value={{ user, adminProfile, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
