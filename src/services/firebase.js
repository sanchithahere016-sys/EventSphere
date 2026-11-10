/**
 * EventSphere Firebase Service & Dual-Mode State Engine
 *
 * Mode 1: Firebase Live Mode (if VITE_FIREBASE_API_KEY is present in .env)
 * Mode 2: Local Persistence Demo Mode (Active by default for offline / college presentations)
 *
 * Persists all events, users, confirmations, reports, check-ins, and favourites
 * to localStorage with full browser refresh persistence.
 */

import { INITIAL_EVENTS } from '../data/initialEvents';
import { INITIAL_USERS } from '../data/initialUsers';

// Keys for local persistence
const STORAGE_KEYS = {
  EVENTS: 'eventsphere_events_v1',
  USERS: 'eventsphere_users_v1',
  CURRENT_USER: 'eventsphere_current_user_v1',
  FAVOURITES: 'eventsphere_favourites_v1',
  NOTIFICATIONS: 'eventsphere_notifications_v1'
};

// Check if Firebase credentials are provided
export const isFirebaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_FIREBASE_API_KEY'
  );
};

// Seed initial data if not present in localStorage
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FAVOURITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify({}));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
}

// Reset data to initial pristine demo state
export function resetToDemoDefaults() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify({}));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
}

// Events Accessors
export function getStoredEvents() {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : INITIAL_EVENTS;
  } catch (e) {
    console.error('Failed to parse events from storage:', e);
    return INITIAL_EVENTS;
  }
}

export function saveStoredEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events to storage:', e);
  }
}

// Users Accessors
export function getStoredUsers() {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch (e) {
    console.error('Failed to parse users from storage:', e);
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to storage:', e);
  }
}

// Current User Session
export function getStoredCurrentUser() {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
    // Default to student demo user for instant interactive exploration
    const defaultUser = INITIAL_USERS.find(u => u.role === 'Normal User') || INITIAL_USERS[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  } catch (e) {
    return INITIAL_USERS[0];
  }
}

export function setStoredCurrentUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Favourites Accessors
export function getStoredFavourites(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    const map = raw ? JSON.parse(raw) : {};
    return map[userId] || [];
  } catch (e) {
    return [];
  }
}

export function toggleStoredFavourite(userId, eventId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    const map = raw ? JSON.parse(raw) : {};
    const userFavs = new Set(map[userId] || []);
    let isFav = false;

    if (userFavs.has(eventId)) {
      userFavs.delete(eventId);
      isFav = false;
    } else {
      userFavs.add(eventId);
      isFav = true;
    }

    map[userId] = [...userFavs];
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(map));
    return { isFavourite: isFav, favourites: map[userId] };
  } catch (e) {
    console.error('Failed to toggle favourite:', e);
    return { isFavourite: false, favourites: [] };
  }
}
