import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredCurrentUser,
  setStoredCurrentUser
} from '../services/firebase';
import { INITIAL_USERS } from '../data/initialUsers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => getStoredUsers());
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());

  // Keep state synchronized with storage
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  useEffect(() => {
    setStoredCurrentUser(currentUser);
  }, [currentUser]);

  // Login handler
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      throw new Error('No account found with this email address.');
    }

    // Demo password or registered password validation
    if (foundUser.demoPassword && foundUser.demoPassword !== password && password !== 'password123') {
      throw new Error(`Invalid password. Demo password is "${foundUser.demoPassword}" (or password123).`);
    }

    setCurrentUser(foundUser);
    return foundUser;
  };

  // Register handler
  const register = ({ name, email, password, role = 'Normal User', institution = 'Apex Institute of Technology' }) => {
    if (!name || name.trim().length < 2) {
      throw new Error('Please enter a valid full name (minimum 2 characters).');
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const isEdu = cleanEmail.endsWith('.edu') || cleanEmail.includes('.ac.in');
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: role,
      institution: institution.trim(),
      institutionVerified: isEdu,
      isVerifiedOrganizer: false,
      title: role === 'Event Organizer' ? 'Student Event Lead' : 'Campus Member',
      avatar: `https://images.unsplash.com/photo-${role === 'Event Organizer' ? '1534528741775-53994a69daeb' : '1535713875002-d1d0cf377fde'}?w=200&auto=format&fit=crop&q=80`,
      bio: `Joined EventSphere community to discover and validate events.`,
      joinedAt: new Date().toISOString(),
      demoPassword: password,
      completedEventsCount: 0,
      flaggedCount: 0
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Quick switch role (vital for live college demonstrations)
  const switchDemoRole = (targetRole) => {
    const demoUser = users.find(u => u.role === targetRole) || INITIAL_USERS.find(u => u.role === targetRole);
    if (demoUser) {
      setCurrentUser(demoUser);
      return demoUser;
    }
    return null;
  };

  // Update profile
  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
  };

  // Admin toggling organizer verification badge
  const toggleOrganizerVerification = (userId) => {
    if (!currentUser || currentUser.role !== 'Administrator') {
      throw new Error('Only Administrators can verify organizer profiles.');
    }
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, isVerifiedOrganizer: !u.isVerifiedOrganizer };
          if (currentUser.id === userId) setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const isAdmin = currentUser?.role === 'Administrator';
  const isOrganizer = currentUser?.role === 'Event Organizer' || isAdmin;
  const isAuthenticated = Boolean(currentUser);

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated,
        isAdmin,
        isOrganizer,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
        toggleOrganizerVerification
      }}
    >
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
