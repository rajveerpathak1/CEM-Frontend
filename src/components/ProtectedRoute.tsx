import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

interface Props {
  children: React.ReactNode;
  roles?: Role[];
}

export default function ProtectedRoute({
  children,
  roles,
}: Props) {
  const { user, loading } = useAuth();

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  /* ---------------- NOT AUTHENTICATED ---------------- */

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ---------------- ROLE CHECK ---------------- */

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* ---------------- ALLOWED ---------------- */

  return <>{children}</>;
}