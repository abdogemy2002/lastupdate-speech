// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        
        // يمكنك هنا إضافة تحقق من صلاحية الـ token إذا كان لديك endpoint للتحقق
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      
      // حفظ البيانات كما تأتي من الـ API
      localStorage.setItem('authToken', userData.token); // استخدم الـ token الفعلي من الرد
      localStorage.setItem('user', JSON.stringify({
        email: userData.email,
        userType: userData.userType,
        // أي بيانات أخرى تحتاجها
      }));
      
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    handleLogin: login, // يمكنك استخدام الاسم الذي تفضله
    handleLogout: logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};