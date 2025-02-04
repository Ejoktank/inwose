import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('token');    
    console.log("Current token:", token); // Debug token
    const isValid = !!token;
    console.log("Is token valid:", isValid); // Debug validation
  
    setIsAuthenticated(isValid);
    return isValid;
  };

  const logout = () => {
    console.log("Logging out");
    
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  useEffect(() => {
    console.log("AuthProvider mounted"); // Debug mounting
    checkAuth();
  }, []);

  useEffect(() => {
    console.log("Authentication state:", isAuthenticated); // Debug state changes
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log(context);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
