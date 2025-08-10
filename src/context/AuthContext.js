import React, { createContext, useState, useEffect, useContext } from 'react';
import userService from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      userService
        .getUserProfile()
        .then(profile => setUser(profile))
        .catch(() => {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const login = async (token) => {
  localStorage.setItem('token', token);
  setIsAuthenticated(true);
  try {
    const profile = await userService.getUserProfile();
    setUser(profile);
  } catch (e) {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    throw e;
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
