import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, api } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGithub: () => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  signup: (name: string, email: string, role: UserRole, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  switchRole: (newRole: 'Seller' | 'Buyer') => Promise<void>;
  githubToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState<string>();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await api.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const loginWithGithub = async () => {
    try {
      const response = await api.loginWithGithub();
      if (response.user && response.githubToken) {
        setUser(response.user);
        setGithubToken(response.githubToken);
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('GitHub login error:', error);
      return null;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const loggedInUser = await api.loginWithGoogle();
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    }
  };

  const signup = async (name: string, email: string, role: UserRole, password: string) => {
    try {
      const newUser = await api.signup(name, email, role, password);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      setGithubToken(undefined);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const switchRole = async (newRole: 'Seller' | 'Buyer') => {
    if (!user) return;
    try {
      const updatedUser = { ...user, role: newRole };
      await api.updateUserRole(user.id, newRole);
      setUser(updatedUser);
    } catch (error) {
      console.error('Role switch error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithGithub,
      loginWithGoogle,
      signup, 
      logout, 
      switchRole,
      githubToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
