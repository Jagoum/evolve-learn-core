import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface MockUser extends Partial<User> {
  id: string;
  email: string;
  user_metadata: { role: 'student' | 'teacher' | 'parent' | 'admin' };
}

interface AuthContextValue {
  user: User | MockUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  enableDemoMode: (role: 'student' | 'teacher' | 'parent' | 'admin') => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode first
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    // For demo purposes, accept any email/password
    if (email && password) {
      const mockUser: MockUser = {
        id: 'demo-user',
        email: email,
        user_metadata: { role: 'student' }
      };
      setUser(mockUser);
      setIsDemoMode(true);
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    } catch (error) {
      return { error: 'An error occurred during sign in' };
    }
  };

  const signUp: AuthContextValue["signUp"] = async (email, password) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      return { error: error?.message ?? null };
    } catch (error) {
      return { error: 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      setIsDemoMode(false);
      return;
    }
    await supabase.auth.signOut();
  };

  const enableDemoMode = (role: 'student' | 'teacher' | 'parent' | 'admin') => {
    const mockUser: MockUser = {
      id: `demo-${role}`,
      email: `${role}@demo.com`,
      user_metadata: { role }
    };
    setUser(mockUser);
    setIsDemoMode(true);
  };

  const value = useMemo<AuthContextValue>(() => ({ 
    user, 
    session, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    enableDemoMode,
    isDemoMode 
  }), [user, session, loading, isDemoMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    window.location.replace("/auth");
    return null;
  }
  return <>{children}</>;
};
