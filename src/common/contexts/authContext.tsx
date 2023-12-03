// AuthProvider.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const token = Cookies.get('token'); // Check for the token in cookies

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  useEffect(() => {
    if (token) {
      setUser(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token: string) => {
    setUser(token);
    setIsAuthenticated(true);
    Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'none' });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('token'); // Remove the token from cookies on logout
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
