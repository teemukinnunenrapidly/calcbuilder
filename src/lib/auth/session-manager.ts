import { Session } from '@supabase/supabase-js';

// Session storage keys
const SESSION_KEY = 'calcbuilder_auth_session';
const REFRESH_TOKEN_KEY = 'calcbuilder_refresh_token';

// Session manager class
export class SessionManager {
  // Store session in localStorage
  static storeSession(session: Session) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      if (session.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
      }
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }

  // Retrieve session from localStorage
  static getStoredSession(): Session | null {
    if (typeof window === 'undefined') return null;

    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    } catch (error) {
      console.error('Error retrieving session:', error);
    }

    return null;
  }

  // Get refresh token from localStorage
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  // Clear session from localStorage
  static clearSession() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // Check if session is expired
  static isSessionExpired(session: Session): boolean {
    if (!session.expires_at) return true;

    const expiryTime = new Date(session.expires_at).getTime();
    const currentTime = Date.now();

    // Consider session expired if it expires within the next 5 minutes
    return currentTime >= expiryTime - 5 * 60 * 1000;
  }

  // Check if session is valid
  static isSessionValid(session: Session): boolean {
    return session && !this.isSessionExpired(session);
  }

  // Get time until session expires (in milliseconds)
  static getTimeUntilExpiry(session: Session): number {
    if (!session.expires_at) return 0;

    const expiryTime = new Date(session.expires_at).getTime();
    const currentTime = Date.now();

    return Math.max(0, expiryTime - currentTime);
  }

  // Check if session needs refresh (refresh if expires within 1 hour)
  static needsRefresh(session: Session): boolean {
    if (!session.expires_at) return true;

    const expiryTime = new Date(session.expires_at).getTime();
    const currentTime = Date.now();

    // Refresh if expires within the next hour
    return currentTime >= expiryTime - 60 * 60 * 1000;
  }
}

// Utility functions for session validation
export const sessionUtils = {
  // Validate JWT token structure (basic validation)
  isValidJWT: (token: string): boolean => {
    if (!token || typeof token !== 'string') return false;

    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1] || ''));

      // Check if payload has required fields
      return !!(payload.iat && payload.exp && payload.sub);
    } catch {
      return false;
    }
  },

  // Decode JWT payload without verification
  decodeJWTPayload: (token: string): any => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      return JSON.parse(atob(parts[1] || ''));
    } catch {
      return null;
    }
  },

  // Get user ID from JWT token
  getUserIdFromToken: (token: string): string | null => {
    const payload = sessionUtils.decodeJWTPayload(token);
    return payload?.sub || null;
  },

  // Check if token has specific claim
  hasClaim: (token: string, claim: string, value?: any): boolean => {
    const payload = sessionUtils.decodeJWTPayload(token);
    if (!payload) return false;

    if (value !== undefined) {
      return payload[claim] === value;
    }

    return payload.hasOwnProperty(claim);
  },
};
