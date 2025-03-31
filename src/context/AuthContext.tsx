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
  userId: string | undefined;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, profile?: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = '/.netlify/functions';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const verifyBackend = async () => {

    // Basic check to verify backend connection
    try {
      const versionResponse = await fetch(`${API_BASE_URL}/version`);
      if (!versionResponse.ok) {
        setError('Failed to connect to backend');
        return false;
      }
      const data = await versionResponse.json();
      if (data.database?.status !== 'connected') {
        setError('Database not connected');
        return false;
      }
    }
    catch (err) {
      setError('Failed to connect to backend' + (err instanceof Error ? (": " + err.message) : ''));
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 3000);
    }
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!await verifyBackend()) {
      setIsLoading(false);
      return false;
    }

    // Attempt login
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login Response", response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      if (data.success) {
        setError(null);
      } else {
        setError('Login Unsuccessful');
      }

      // Save auth data
      setIsLoggedIn(true);
      setUsername(username);
      setToken(data.token);
      setUser(data.user);
      setUserId(data.user.id);

      // Store in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setIsLoading(false);
      return true;

    } catch (err) {
      setError('Login Failed' + (err instanceof Error ? (": " + err.message) : ''));
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (username: string, password: string, profile: Partial<UserProfile> = {}): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!await verifyBackend()) {
      setIsLoading(false);
      return false;
    }

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
      setError(null);

      // Save auth data
      setIsLoggedIn(true);
      setUsername(username);
      setToken(data.token);
      setUser(data.user);

      // Store in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setIsLoading(false);
      return true;

    } catch (err) {
      setError('Registration failed' + (err instanceof Error ? (": " + err.message) : ''));
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    return false;
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

  const verifyToken = async () => {
    if (!token) return false;

    try {
      const response = await fetch('/.netlify/functions/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getSelf',
          username,
          token
        }),
      });
      if (!response.ok) {
        logout();
      }

      return true;
    } catch (err) {
      console.error('Error verifying token:', err);
      logout();
      return false;
    }
  }

  // Check for existing auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    verifyToken();
    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData) as User;
        setIsLoggedIn(true);
        setUsername(userData.username);
        setToken(storedToken);
        setUser(userData);
        setUserId(userData.id);
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
      userId,
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
