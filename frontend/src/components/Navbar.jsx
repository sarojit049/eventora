import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, User, LogOut, LayoutDashboard, Ticket } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-navy-900">
              Evento<span className="text-primary-600">ra</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors" id="nav-home">
              Home
            </Link>
            <Link to="/events" className="px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors" id="nav-events">
              Events
            </Link>
            {isAuthenticated && (
              <Link to="/bookings" className="px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors" id="nav-bookings">
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors" id="nav-admin">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-navy-50 transition-colors"
                  id="nav-profile-btn"
                >
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-navy-700">{user?.name?.split(' ')[0]}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-navy-100 py-2 animate-slide-down" id="nav-profile-dropdown">
                    <div className="px-4 py-2 border-b border-navy-100">
                      <p className="text-sm font-medium text-navy-900">{user?.name}</p>
                      <p className="text-xs text-navy-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 hover:text-navy-900">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 hover:text-navy-900">
                      <Ticket className="w-4 h-4" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 hover:text-navy-900">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-navy-100" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left" id="nav-logout-btn">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost btn-sm" id="nav-login">Sign In</Link>
                <Link to="/register" className="btn-primary btn-sm" id="nav-register">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg"
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-navy-100 animate-slide-down" id="nav-mobile-menu">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-lg">Home</Link>
            <Link to="/events" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-lg">Events</Link>
            {isAuthenticated && (
              <Link to="/bookings" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-lg">My Bookings</Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-lg">Admin Dashboard</Link>
            )}
            <hr className="my-2 border-navy-100" />
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-navy-500">Signed in as <span className="font-medium text-navy-700">{user?.name}</span></div>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
