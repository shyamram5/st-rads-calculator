import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // If running on localhost (or typical local network addresses) treat this
      // as development and skip authentication checks so developers are not
      // redirected to external login pages while working locally.
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        const isLocalHost = host === 'localhost' || host === '127.0.0.1' || /^192\.168\./.test(host) || /^10\./.test(host);
        if (isLocalHost || import.meta.env.MODE === 'development') {
          console.warn('Running on localhost/development — skipping Base44 auth checks');
          setAppPublicSettings({ id: 'dev', public_settings: {} });
          // Provide a lightweight mock user so the app behaves as "logged in"
          // during local development and avoids redirect/login flows.
          const mockUser = {
            id: 'dev-user',
            email: 'dev@local',
            full_name: 'Developer',
            subscription_tier: 'free',
            analyses_used: 0
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          setIsLoadingPublicSettings(false);
          setIsLoadingAuth(false);
          return;
        }
      }

      // In development mode, skip the app public settings check if no serverUrl
      if (!appParams.serverUrl) {
        console.warn('VITE_BASE44_BACKEND_URL not set - running in development mode without auth');
        setAppPublicSettings({ id: 'dev', public_settings: {} });
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        return;
      }
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `${appParams.serverUrl}/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });
      
      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);
        
        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      
      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      base44.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Redirect to an external Base44 login only when the configured server URL
    // points to a different origin than the current app. Otherwise prefer the
    // SDK redirect (if available) or fall back to the app root to avoid
    // redirecting to a missing local `/login` route.
    try {
      const from = encodeURIComponent(window.location.href);
      const serverUrl = appParams.serverUrl || '';

      // If no external server URL is configured, avoid calling the SDK
      // redirect which can point to a local `/login` route that doesn't exist
      // in the SPA. Instead, redirect to the app root.
      if (!serverUrl) {
        console.warn('navigateToLogin: no serverUrl configured, redirecting to app root');
        window.location.href = '/';
        return;
      }

      if (serverUrl) {
        try {
          const parsed = new URL(serverUrl, window.location.href);
          // If serverUrl origin differs from current origin, send user there
          if (parsed.origin !== window.location.origin) {
            const basePath = `${parsed.origin.replace(/\/$/, '')}${parsed.pathname.replace(/\/$/, '')}`;
            window.location.href = `${basePath}/login?from_url=${from}`;
            return;
          }
        } catch (e) {
          // parsing failed — fall through to SDK or root fallback
          console.warn('navigateToLogin: failed to parse serverUrl, falling back', e);
        }
      }

      // Prefer the SDK's redirect if available (handles tokens and return URL)
      if (base44 && base44.auth && typeof base44.auth.redirectToLogin === 'function') {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      // Final fallback: go to app root (safe, no /login 404)
      window.location.href = '/';
    } catch (e) {
      console.error('navigateToLogin error:', e);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
