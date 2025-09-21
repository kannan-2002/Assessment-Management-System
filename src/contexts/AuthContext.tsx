import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Demo authentication - in production, this would call your API
      if (email === 'admin@test.com' && password === 'admin123') {
        const user = {
          id: '1',
          email,
          name: 'Admin User',
          role: 'admin' as const
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } else if (email === 'user@test.com' && password === 'user123') {
        const user = {
          id: '2',
          email,
          name: 'Test User',
          role: 'user' as const
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Demo registration
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'user' as const
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};