import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard, ChevronDown, Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = hasRole(['admin', 'super-admin']) ? '/admin/dashboard' : '/student/dashboard';

  return (
    <nav className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-slate-200/80 transition-all duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-250">
              <Calendar className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-display bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
              CampusEvents
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/events" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors duration-200">
              Browse Events
            </Link>
            {user && (
              <Link to={dashboardPath} className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors duration-200">
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100/80 active:scale-95 transition-all duration-200 border border-transparent hover:border-slate-200/60"
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-full flex items-center justify-center shadow-inner border border-emerald-200/50">
                    <span className="text-emerald-800 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-100 py-1.5 z-50 animate-fade-in-up">
                    <div className="px-4 py-3.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate mb-2">{user.email}</p>
                      <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider font-bold rounded-md border border-emerald-100/55">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/student/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile Settings
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/70 transition-colors duration-150 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95 transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all duration-150"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md animate-fade-in-up">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/events"
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Browse Events
            </Link>
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/profile"
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50/70"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-sm font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

