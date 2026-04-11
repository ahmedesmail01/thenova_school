import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/useAuthStore";

export function NavbarAuth() {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-navy/90 backdrop-blur-md border-b border-brand-border h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          {/* Place logo.svg in /public/ */}
          <img
            src="/logo.svg"
            alt="Nova Group"
            className="h-8 hidden sm:block"
          />
          <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform sm:hidden">
            N
          </div>
          <span className="text-white font-bold tracking-widest hidden sm:inline">
            NOVA GROUP
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/dashboard"
            className="text-text-secondary hover:text-white transition-colors [&.active]:text-white [&.active]:font-bold"
          >
            Home
          </Link>
          <Link
            to="/library"
            className="text-text-secondary hover:text-white transition-colors [&.active]:text-white [&.active]:font-bold"
          >
            Courses
          </Link>
          <Link
            to="/courses"
            className="text-text-secondary hover:text-white transition-colors [&.active]:text-white [&.active]:font-bold"
          >
            Browse All
          </Link>
        </div>

        {/* User avatar + dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User menu"
          >
            <div className="relative">
              <img
                src={user?.avatarUrl ?? "/images/default-avatar.png"}
                alt={user?.first_name ?? "User"}
                className="w-9 h-9 rounded-full object-cover border-2 border-brand-border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = "/images/default-avatar.png";
                }}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-brand-navy rounded-full" />
            </div>
            <span className="hidden sm:block text-sm text-white font-medium">
              {user?.first_name}
            </span>
            <span
              className={`text-text-muted text-[10px] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-12 w-56 bg-brand-surface border border-brand-border rounded-xl shadow-modal py-2 z-50">
                {/* Profile preview */}
                <div className="px-4 py-3 border-b border-brand-border">
                  <p className="font-semibold text-white text-sm">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    <span>👤</span> View Profile
                  </button>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <span>📊</span> Dashboard
                  </Link>
                  <Link
                    to="/library"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <span>📚</span> My Courses
                  </Link>
                </div>
                <hr className="border-brand-border my-1" />
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors flex items-center gap-3"
                    onClick={handleLogout}
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
