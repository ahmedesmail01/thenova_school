import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../features/auth/useAuthStore";
import {
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
const logoImg = "/images/nova-logo.png";

export function Navbar() {
  const { setLoginModalOpen, isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setShowUserDropdown(false);
    navigate({ to: "/" });
  };

  // Suppress unused warning — kept for any legacy usage
  void setLoginModalOpen;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md  h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoImg}
            alt="Nova Group"
            className="  w-[130px] h-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-white font-bold tracking-widest hidden sm:inline">
            NOVA GROUP
          </span> */}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            activeOptions={{ exact: true, includeHash: true }}
            className="text-text-secondary hover:text-brand-blue-light transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Home
          </Link>
          <Link
            to="/"
            hash="packages"
            activeOptions={{ includeHash: true }}
            className="text-text-secondary hover:text-brand-blue-light transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Packages
          </Link>
          <Link
            to="/courses"
            className="text-text-secondary hover:text-brand-blue-light transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Courses
          </Link>
        </div>

        {/* Auth CTAs — conditionally render based on login status */}
        <div className="hidden md:flex  items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2  text-[15px] py-[10px] px-[20px] bg-none"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>{user?.first_name || "Account"}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showUserDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Desktop Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-brand-navy border border-brand-border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                  <hr className="border-brand-border my-1 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="shadow-lg text-[15px] py-[10px] px-[26px] shadow-brand-blue/20"
                >
                  Sign up
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/5 text-[15px] py-[10px] px-[26px] border border-white rounded-[8px]"
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5 flex flex-col items-end">
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"}`}
            />
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : "w-4"}`}
            />
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-brand-navy/95 border-b border-brand-border overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-4 flex flex-col gap-2">
          <Link
            to="/"
            activeOptions={{ exact: true, includeHash: true }}
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Home
          </Link>
          <Link
            to="/"
            hash="packages"
            activeOptions={{ includeHash: true }}
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Packages
          </Link>
          <Link
            to="/courses"
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            Courses
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            About
          </Link>
          <hr className="border-brand-border my-1" />
          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-400 hover:text-red-300 p-3 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
