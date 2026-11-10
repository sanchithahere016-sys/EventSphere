import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Compass,
  PlusCircle,
  FolderHeart,
  Info,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Camera,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentRoute, onNavigate, onOpenScanner }) {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'explore', label: 'Explore Events', icon: Compass },
    { id: 'submit', label: 'Submit Event', icon: PlusCircle },
    { id: 'my-events', label: 'My Events', icon: FolderHeart },
    { id: 'about', label: 'About', icon: Info },
  ];

  if (isAdmin) {
    navLinks.push({ id: 'admin', label: 'Admin Portal', icon: Shield, badge: 'Admin' });
  }

  const handleNav = (route) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Custom Logo: Calendar with integrated verification checkmark */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-600 p-0.5 shadow-soft flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-gradient-to-tr from-brand-600 to-accent-600 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Calendar className="w-5 h-5 text-white/90" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">Sphere</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded-md border border-brand-200/60">
                  Trust Engine
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-400 font-medium">
                Discover Events. Build Trust. Connect Communities.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-extrabold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick QR Attendance Scanner Trigger */}
            <button
              onClick={onOpenScanner}
              className="p-2.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-slate-200/80 shadow-xs flex items-center gap-1.5 text-xs font-semibold"
              title="Launch QR Attendance Scanner"
            >
              <Camera className="w-4 h-4 text-brand-600" />
              <span className="hidden xl:inline">Scan Pass</span>
            </button>

            {/* Authenticated user menu vs Login button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left shadow-xs"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {currentUser.role}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('my-events')}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <FolderHeart className="w-4 h-4 text-slate-400" />
                      <span>My Events & Passes</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full px-4 py-2 text-left text-xs text-brand-600 hover:bg-brand-50 flex items-center gap-2 font-bold"
                      >
                        <Shield className="w-4 h-4 text-brand-600" />
                        <span>Administrator Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          handleNav('home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('auth')}
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition-all"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenScanner}
              className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl"
              title="QR Scanner"
            >
              <Camera className="w-5 h-5 text-brand-600" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentRoute === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('auth')}
                className="w-full py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
