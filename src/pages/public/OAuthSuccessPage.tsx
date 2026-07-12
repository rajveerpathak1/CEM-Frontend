import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "../../api/client";
import { authApi } from "../../api";
import toast from "react-hot-toast";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAccessToken(token);
      
      // Fetch user profile to determine their role and redirect accordingly
      authApi.getMe()
        .then((user) => {
          toast.success("Logged in with Google successfully!");
          if (user.role === 'admin') {
            window.location.href = "/admin/dashboard";
          } else if (user.role === 'super-admin') {
            window.location.href = "/super-admin/users";
          } else {
            window.location.href = "/student/dashboard";
          }
        })
        .catch(() => {
          toast.success("Logged in with Google successfully!");
          window.location.href = "/student/dashboard";
        });
    } else {
      toast.error("Google authentication failed.");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-700">Completing Google Sign In...</h2>
        <p className="text-sm text-gray-500 mt-1">Please wait while we set up your session.</p>
      </div>
    </div>
  );
}
