'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
  location?: string;
}

interface User {
  id: string;
  username: string;
  profile: UserProfile;
}

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, profile?: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = '/.netlify/functions';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Save auth data
      setIsLoggedIn(true);
      setUsername(username);
      setToken(data.token);
      setUser(data.user);
      
      // Store in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, profile: Partial<UserProfile> = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, profile }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Save auth data
      setIsLoggedIn(true);
      setUsername(username);
      setToken(data.token);
      setUser(data.user);
      
      // Store in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setIsLoggedIn(false);
    setUsername('');
    setToken(null);
    setUser(null);
    
    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // Check for existing auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');

    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData) as User;
        setIsLoggedIn(true);
        setUsername(userData.username);
        setToken(storedToken);
        setUser(userData);
      } catch (err) {
        console.error('Error restoring authentication state:', err);
        logout(); // Clear potentially corrupted auth data
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      token, 
      user, 
      isLoading, 
      error, 
      login, 
      register, 
      logout 
    }}>
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
