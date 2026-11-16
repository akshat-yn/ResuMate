import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'user_alex',
  email: 'alex.morgan@resumeai.io',
  full_name: 'Alex Morgan',
  target_role: 'Senior Full Stack Engineer',
  experience_level: 'Senior Level (7+ yrs)',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('resumeai_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('resumeai_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Client-side authentication
    const registeredUsers = JSON.parse(localStorage.getItem('resumeai_registered_users') || '[]');
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      if (existing.password !== password) {
        throw new Error('Invalid email or password.');
      }
      setUser(existing);
      localStorage.setItem('resumeai_user', JSON.stringify(existing));
      return existing;
    }

    // Default fallback demo login
    const loggedUser = {
      id: 'user_' + Date.now(),
      email,
      full_name: email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
      target_role: 'Software Engineer',
      experience_level: 'Mid Level (3-6 yrs)',
    };
    setUser(loggedUser);
    localStorage.setItem('resumeai_user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = async (email, password, fullName, targetRole, experienceLevel) => {
    const registeredUsers = JSON.parse(localStorage.getItem('resumeai_registered_users') || '[]');
    if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password,
      full_name: fullName,
      target_role: targetRole || 'Software Engineer',
      experience_level: experienceLevel || 'Mid Level (3-6 yrs)',
    };

    registeredUsers.push(newUser);
    localStorage.setItem('resumeai_registered_users', JSON.stringify(registeredUsers));
    setUser(newUser);
    localStorage.setItem('resumeai_user', JSON.stringify(newUser));
    return newUser;
  };

  const loginDemo = () => {
    setUser(DEFAULT_USER);
    localStorage.setItem('resumeai_user', JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resumeai_user');
  };

  const updateProfileState = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('resumeai_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginDemo, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
