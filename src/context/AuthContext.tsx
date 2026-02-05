'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from './Analytics';

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
  getSubToken: (category: string) => Promise<string | null>;
}

interface SubToken {
  token: string;
  category: string;
  expiresIn: number;
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
  const pathname = usePathname();

  const [subtokens, setSubtokens] = useState<Record<string, SubToken>>({});

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
  }, [error]);

  // set userid to session when logged in
  useEffect(() => {
    if (isLoggedIn && userId) {
      analytics.setUserId(userId);
    }
  }, [isLoggedIn, userId]);

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
  };

  const generateSubToken = async (category: string): Promise<string | null> => {
    if (!token || !username || !isLoggedIn) {
      setError('Not authenticated');
      return null;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/get-sub-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, token, category }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get sub token');
      }
      const data = await response.json();
      console.log("Generated subtoken for category: ", category);
      setSubtokens(prev => ({ ...prev, [category]: { token: data.subToken, category: data.category, expiresIn: data.expiresIn } }));
      return data.subToken || null;
    } catch (err) {
      console.log("Error generating subtoken: ", err);
      setError('Failed to get sub token' + (err instanceof Error ? (": " + err.message) : ''));
      return null;
    }
  };

  const getSubToken = async (category: string): Promise<string | null> => {
    // subtokens for each category are stored in "subtokens"
    // it stores tokens for each category, and refreshes tokens that are close to expiration
    // to avoid waiting for token generation during critical flows

    if (!token || !username || !isLoggedIn) {
      setError('Not authenticated');
      return null;
    }

    if (subtokens[category] && subtokens[category].expiresIn > Date.now()) { // existing valid token

      if (subtokens[category].expiresIn - Date.now() < 5 * 60 * 1000) { // if token expires in less than 5 minute
        generateSubToken(category);

        return subtokens[category].token;
      }

    }
    // no existing token, or token expired;
    // await token fetching
    return await generateSubToken(category);
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
  };

  const logout = () => {
    // Clear state
    setIsLoggedIn(false);
    setUsername('');
    setToken(null);
    setUser(null);

    // Clear subtokens
    setSubtokens({});

    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const verifyToken = async (username?: string, token?: string) => {
    if (!token) return false;
    if (!username) return false;

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
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error verifying token:', err);
      return false;
    }
  }


  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      if (storedToken && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData) as User;
          const isValid = await verifyToken(userData.username, storedToken);
          if (!isValid) {
            throw new Error('Invalid token or username');
          }
          setIsLoggedIn(true);
          setUsername(userData.username);
          setToken(storedToken);
          setUser(userData);
          setUserId(userData.id);
        } catch (err) {
          console.error('Error loading auth data:', err);
          logout(); // Clear potentially corrupted auth data
        }
      }
    };
    checkAuth();
  }, []);

  // Periodically verify token validity every 5 minutes to auto-logout if token becomes invalid (e.g., revoked, expired, etc.)
  // also clear expired subtokens
  useEffect(() => {


    if (token && username) {
      // Set up periodic token verification
      const verifyInterval = setInterval(async () => {

        // clear expired subtokens
        const now = Date.now();
        setSubtokens(prev => {
          return Object.entries(prev).reduce((acc, [key, value]) => {
            if (value.expiresIn > now) {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, SubToken>);
        });


        const isValid = await verifyToken(username, token);
        if (!isValid) {
          logout();
        }
      }, 60 * 1000); // Every 5 minutes

      return () => clearInterval(verifyInterval);
    }
  }, [token, username]);

  // Session metadata - only run once
  useEffect(() => {
    analytics.sessionMetadata();
  }, []);

  // Track pageviews on pathname change
  useEffect(() => {
    analytics.pageview();
  }, [pathname]);

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
      logout,
      getSubToken
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
