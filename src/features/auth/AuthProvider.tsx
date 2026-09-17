"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "./auth.api";

import type { AuthState, LoginInput, User } from "./auth.types";

interface AuthContextValue extends AuthState {
  login: (input: LoginInput) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authVersion = useRef(0);

  const refreshUser = useCallback(async () => {
    const version = ++authVersion.current;

    try {
      const currentUser = await getCurrentUser();

      if (version === authVersion.current) {
        setUser(currentUser);
      }
    } catch {
      if (version === authVersion.current) {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const version = authVersion.current;

    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();

        if (version === authVersion.current) {
          setUser(currentUser);
        }
      } catch {
        if (version === authVersion.current) {
          setUser(null);
        }
      } finally {
        if (version === authVersion.current) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const authenticatedUser = await loginRequest(input);

    // Invalidate any older /me request.
    authVersion.current += 1;

    setUser(authenticatedUser);
    setIsLoading(false);

    return authenticatedUser;
  }, []);

  const logout = useCallback(async () => {
    // Invalidate any outstanding auth request.
    authVersion.current += 1;

    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
