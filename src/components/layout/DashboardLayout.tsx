import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  UserCog,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const studentLinks: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/student/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My Registrations',
    path: '/student/registrations',
    icon: ClipboardList,
  },
  {
    label: 'Profile',
    path: '/student/profile',
    icon: Settings,
  },
];

const adminLinks: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Create Event',
    path: '/admin/events/create',
    icon: PlusCircle,
  },
  {
    label: 'Manage Events',
    path: '/admin/events',
    icon: Calendar,
  },
  {
    label: 'Registrations',
    path: '/admin/registrations',
    icon: ClipboardList,
  },
];

const superAdminLinks: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Create Event',
    path: '/admin/events/create',
    icon: PlusCircle,
  },
  {
    label: 'Manage Events',
    path: '/admin/events',
    icon: Calendar,
  },
  {
    label: 'Registrations',
    path: '/admin/registrations',
    icon: ClipboardList,
  },
  {
    label: 'User Management',
    path: '/super-admin/users',
    icon: Users,
  },
  {
    label: 'Roles',
    path: '/super-admin/roles',
    icon: UserCog,
  },
  {
    label: 'My Registrations',
    path: '/student/registrations',
    icon: ClipboardList,
  },
  {
    label: 'Profile',
    path: '/student/profile',
    icon: Settings,
  },
];
export default function DashboardLayout() {
  const { user, logout, hasRole } = useAuth();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = hasRole(['super-admin'])
    ? superAdminLinks
    : hasRole(['admin'])
    ? adminLinks
    : studentLinks;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const sidebar = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">CE</span>
        </div>

        <div>
          <p className="text-lg font-bold text-gray-900">CampusEvents</p>
          <p className="text-xs text-gray-500">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-gray-50">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-700 font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed inset-y-0 shadow-sm">
        {sidebar}
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CE</span>
            </div>

            <span className="font-semibold text-gray-900">
              CampusEvents
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name}
              </p>

              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>

            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-700 font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}