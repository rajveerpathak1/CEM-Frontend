import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { authApi } from "../api";
import type { User, Role } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
        const currentUser = await authApi.getMe();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /* ---------------- LOGIN ---------------- */

  const login = async (
    email: string,
    password: string
  ) => {
    // login only sets session cookie
    await authApi.login(email, password);

    // fetch actual user
    const currentUser = await authApi.getMe();

    setUser(currentUser);
  };

  /* ---------------- SIGNUP ---------------- */

  const signup = async (
    name: string,
    email: string,
    password: string
  ) => {
    // signup does NOT auto-login
    await authApi.signup(name, email, password);
  };

  /* ---------------- LOGOUT ---------------- */

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
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