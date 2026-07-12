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
    label: 'Profile Settings',
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
  {
    label: 'Profile Settings',
    path: '/student/profile',
    icon: Settings,
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
    label: 'Profile Settings',
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
    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border-l-4 ${
      isActive
        ? 'bg-gradient-to-r from-emerald-50 to-teal-50/30 text-emerald-700 border-emerald-500 shadow-sm'
        : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
    }`;

  const sidebar = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100/85">
        <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/10">
          <Calendar className="text-white w-5.5 h-5.5" />
        </div>

        <div>
          <p className="text-base font-bold text-slate-900 font-display">CampusEvents</p>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Portal Control</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
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
      <div className="px-4 py-5 border-t border-slate-100/85">
        <div className="flex items-center gap-3 px-3.5 py-3 mb-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-full flex items-center justify-center border border-emerald-200/40">
            <span className="text-emerald-800 font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.name}
            </p>

            <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-50/80 text-emerald-700 text-[9px] uppercase tracking-wider font-bold rounded-md border border-emerald-100/50 mt-0.5 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50/70 transition-colors active:scale-95 duration-150"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200/60 fixed inset-y-0 shadow-sm z-20">
        {sidebar}
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-66 bg-white shadow-2xl flex flex-col animate-fade-in-up">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
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
        <header className="sticky top-0 z-10 bg-white/75 backdrop-blur-md border-b border-slate-200/55 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8.5 h-8.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/10">
              <Calendar className="text-white w-4.5 h-4.5" />
            </div>

            <span className="font-bold text-slate-900 font-display">
              CampusEvents
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">
                {user?.name}
              </p>

              <span className="inline-flex items-center px-1.5 py-0.2 bg-emerald-50/50 text-emerald-700 text-[9px] uppercase tracking-wider font-bold rounded-md border border-emerald-100/40 capitalize">
                {user?.role}
              </span>
            </div>

            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-full flex items-center justify-center border border-emerald-200/40">
              <span className="text-emerald-800 font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
}