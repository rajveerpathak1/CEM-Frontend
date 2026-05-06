import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Public
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import BrowseEventsPage from './pages/public/BrowseEventsPage';
import EventDetailsPage from './pages/public/EventDetailsPage';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import MyRegistrationsPage from './pages/student/MyRegistrationsPage';
import ProfilePage from './pages/student/ProfilePage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEventPage from './pages/admin/CreateEventPage';
import EditEventPage from './pages/admin/EditEventPage';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import RegistrationsPage from './pages/admin/RegistrationsPage';

// Super Admin
import UserManagementPage from './pages/super-admin/UserManagementPage';
import RolesPage from './pages/super-admin/RolesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
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
            <Route path="/events" element={<BrowseEventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />

            {/* Student routes */}
            <Route
              element={
                <ProtectedRoute roles={['student', 'admin', 'super-admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/registrations" element={<MyRegistrationsPage />} />
              <Route path="/student/profile" element={<ProfilePage />} />

              {/* Admin routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin', 'super-admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/create"
                element={
                  <ProtectedRoute roles={['admin', 'super-admin']}>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/edit"
                element={
                  <ProtectedRoute roles={['admin', 'super-admin']}>
                    <EditEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute roles={['admin', 'super-admin']}>
                    <ManageEventsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/registrations"
                element={
                  <ProtectedRoute roles={['admin', 'super-admin']}>
                    <RegistrationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin routes */}
              <Route
                path="/super-admin/users"
                element={
                  <ProtectedRoute roles={['super-admin']}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/roles"
                element={
                  <ProtectedRoute roles={['super-admin']}>
                    <RolesPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
