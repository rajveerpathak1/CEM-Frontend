import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { user, loading } = useAuth();

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  /* ---------------- REDIRECT AUTHENTICATED USERS ---------------- */

  if (user) {
    switch (user.role) {
      case "student":
        return (
          <Navigate
            to="/student/dashboard"
            replace
          />
        );

      case "admin":
        return (
          <Navigate
            to="/admin/dashboard"
            replace
          />
        );

      case "super-admin":
        return (
          <Navigate
            to="/super-admin/users"
            replace
          />
        );

      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}