import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { authApi } from "../api";
import { setAccessToken } from "../api/client";
import type { User, Role } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  // loading = checking auth persistence
  const [loading, setLoading] = useState(true);

  /* ---------------- AUTH HYDRATION ---------------- */

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try refreshing the access token first using the HttpOnly refresh cookie
        const response = await authApi.refresh();
        if (response.accessToken) {
          setAccessToken(response.accessToken);
          const currentUser = await authApi.getMe();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /* ---------------- LISTEN TO AUTH EXPIRATION ---------------- */

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  /* ---------------- LOGIN ---------------- */

  const login = async (
    email: string,
    password: string
  ): Promise<User> => {
    const response = await authApi.login(email, password);
    
    // Store access token in memory
    setAccessToken(response.accessToken);

    // Set user info
    setUser(response.user);

    return response.user;
  };

  /* ---------------- SIGNUP ---------------- */

  const signup = async (
    name: string,
    email: string,
    password: string
  ) => {
    // signup does NOT auto-login and sends verify email
    await authApi.signup(name, email, password);
  };

  /* ---------------- LOGOUT ---------------- */

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  /* ---------------- ROLE CHECK ---------------- */

  const hasRole = (roles: Role[]) => {
    if (!user) return false;

    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}