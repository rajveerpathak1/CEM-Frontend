import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "../../api/client";
import toast from "react-hot-toast";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // We can hook into login or manually set the user in context if needed.
  // Wait, let's look at what AuthContext exports:
  // user, loading, login, signup, logout, hasRole. It doesn't export setUser.
  // Wait! How do we update the user object in AuthContext?
  // If we perform setAccessToken(token), and then reload or trigger something,
  // can we trigger initializeAuth or a reload?
  // Wait! In AuthContext, we can't manually set the user. But wait, if we
  // navigate to /student/dashboard or reload the app, initializeAuth will run on mount,
  // call authApi.refresh() or getMe(), and successfully authenticate.
  // But wait! If we do window.location.href = "/student/dashboard", the entire React app
  // reloads, which triggers initializeAuth, which calls authApi.refresh()!
  // Wait, is there a refreshToken cookie already set? Yes, the backend callback
  // sets the HTTP-Only refreshToken cookie, and puts the accessToken in the query param.
  // So if we reload or navigate, the refresh token cookie is already present!
  // Wait, if the refresh token cookie is present, then on full page load, initializeAuth
  // will call authApi.refresh(), get a fresh access token, and fetch the user.
  // But to make it smoother without a full page reload, can we support setting user?
  // Wait! Let's check if we can add a method or if we can reload the app.
  // Actually, full page reload is extremely simple and robust because it completely clears
  // any previous in-memory state and forces AuthContext's useEffect to run.
  // Let's do:
  // setAccessToken(token);
  // and reload: window.location.href = "/student/dashboard".
  // Wait! If we set the token in memory first, and then do window.location.href, the in-memory token is lost on reload!
  // But the HTTP-Only cookie `refreshToken` is persistent! So on reload, the browser automatically sends
  // the refreshToken cookie to `/auth/refresh` on mount, which returns the new accessToken!
  // Yes! That is absolutely correct and standard.
  // Alternatively, we can just do window.location.href = "/student/dashboard" because the cookie is already set by the backend callback redirect.
  // Let's verify:
  // Does the backend oauthCallback set the cookie?
  // Yes, lines 187-195 in oauthController.js:
  // res.cookie(authConfig.refreshCookieName, refreshToken, getRefreshCookieOptions());
  // So the refresh cookie is already set!
  // Let's also set it in localStorage as a temporary backup or just let the cookie do the work.
  // Since the cookie is HttpOnly, the browser holds it. On reload, initializeAuth will automatically refresh it.
  // Let's write the component to set the access token in client.ts, fetch the user profiles, and navigate using React Router (to avoid full page reload if possible).
  // Wait, if we use React Router to navigate, how do we update the user state in AuthContext?
  // Oh! We can add a function to AuthContext or we can just use window.location.href = "/student/dashboard" which is very safe and reliable.
  // Wait, let's see. If we use window.location.href, it works perfectly and hydrates instantly.
  // Let's implement both: set the token in client.ts, and then reload/redirect.
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAccessToken(token);
      toast.success("Logged in with Google successfully!");
      // Redirect to student dashboard and trigger a reload to hydrate auth context
      window.location.href = "/student/dashboard";
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
