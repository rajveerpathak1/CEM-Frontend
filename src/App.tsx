import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import DashboardLayout from "./components/layout/DashboardLayout";

/* ---------------- PUBLIC PAGES ---------------- */

import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";
import BrowseEventsPage from "./pages/public/BrowseEventsPage";
import EventDetailsPage from "./pages/public/EventDetailsPage";

/* ---------------- STUDENT ---------------- */

import StudentDashboard from "./pages/student/StudentDashboard";
import MyRegistrationsPage from "./pages/student/MyRegistrationsPage";
import ProfilePage from "./pages/student/ProfilePage";

/* ---------------- ADMIN ---------------- */

import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateEventPage from "./pages/admin/CreateEventPage";
import EditEventPage from "./pages/admin/EditEventPage";
import ManageEventsPage from "./pages/admin/ManageEventsPage";
import RegistrationsPage from "./pages/admin/RegistrationsPage";

/* ---------------- SUPER ADMIN ---------------- */

import UserManagementPage from "./pages/super-admin/UserManagementPage";
import RolesPage from "./pages/super-admin/RolesPage";

/* ---------------- QUERY CLIENT ---------------- */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
    mutations: {
  retry: 0,
},
  },
});

/* ---------------- APP ---------------- */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ================================================= */}
            {/* PUBLIC ROUTES */}
            {/* ================================================= */}

            <Route path="/" element={<LandingPage />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            <Route
              path="/events"
              element={<BrowseEventsPage />}
            />

            <Route
              path="/events/:id"
              element={<EventDetailsPage />}
            />

            {/* ================================================= */}
            {/* STUDENT ROUTES */}
            {/* ================================================= */}

            <Route
              element={
                <ProtectedRoute
                  roles={[
                    "student",
                    "admin",
                    "super-admin",
                  ]}
                >
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/student/dashboard"
                element={<StudentDashboard />}
              />

              <Route
                path="/student/registrations"
                element={<MyRegistrationsPage />}
              />

              <Route
                path="/student/profile"
                element={<ProfilePage />}
              />
            </Route>

            {/* ================================================= */}
            {/* ADMIN ROUTES */}
            {/* ================================================= */}

            <Route
              element={
                <ProtectedRoute
                  roles={["admin", "super-admin"]}
                >
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/events"
                element={<ManageEventsPage />}
              />

              <Route
                path="/admin/events/create"
                element={<CreateEventPage />}
              />

              <Route
                path="/admin/events/:id/edit"
                element={<EditEventPage />}
              />

              <Route
                path="/admin/registrations"
                element={<RegistrationsPage />}
              />
            </Route>

            {/* ================================================= */}
            {/* SUPER ADMIN ROUTES */}
            {/* ================================================= */}

            <Route
              element={
                <ProtectedRoute
                  roles={["super-admin"]}
                >
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/super-admin/users"
                element={<UserManagementPage />}
              />

              <Route
                path="/super-admin/roles"
                element={<RolesPage />}
              />
            </Route>

            {/* ================================================= */}
            {/* FALLBACK */}
            {/* ================================================= */}

            <Route
              path="*"
              element={
                <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>
        </BrowserRouter>

        {/* ================================================= */}
        {/* TOASTS */}
        {/* ================================================= */}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}