'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AuthApi, User, LoginDto, RegisterDto } from '@/lib/api/auth.api';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AUTH_TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookie() {
      const token = Cookies.get(AUTH_TOKEN_KEY);
      if (token) {
        try {
          const profile = await AuthApi.getMe(token);
          setUser(profile);
        } catch (error) {
          console.error('Failed to load user profile, clearing token:', error);
          Cookies.remove(AUTH_TOKEN_KEY);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUserFromCookie();
  }, []);

  const login = async (dto: LoginDto) => {
    setLoading(true);
    try {
      const response = await AuthApi.login(dto);
      Cookies.set(AUTH_TOKEN_KEY, response.access_token, { expires: 7 }); // expires in 7 days
      setUser(response.user);
      // Redirect based on role
      router.push(response.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (dto: RegisterDto) => {
    setLoading(true);
    try {
      await AuthApi.register(dto);
      router.push('/login?registered=true');
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove(AUTH_TOKEN_KEY);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
