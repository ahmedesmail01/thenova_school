import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useUserData } from "../../features/auth/useUserData";
import {
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
const logoImg = "/images/nova-logo.png";

export function Navbar() {
  const { setLoginModalOpen, isAuthenticated, logout } = useAuthStore();
  const { data: userData } = useUserData();
  const user = userData?.["user data"];
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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-navy  h-16">
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
          <a
            href="https://test.thenovagroupco.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-brand-blue-light transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Home
          </a>
          <a
            href="https://test.thenovagroupco.com/packages"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-brand-blue-light transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Packages
          </a>
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
                <div className="absolute right-0 mt-2 w-64 bg-dash-sidebar border border-dash-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in duration-200">
                  {/* User Header */}
                  <div className="flex items-center gap-3 p-3 border-b border-dash-border/50 mb-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-dash-bg border border-dash-border flex items-center justify-center shrink-0">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-dash-muted" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold  text-dash-accent truncate">
                        {user?.first_name} {user?.last_name}
                      </span>
                      <span className="text-xs text-dash-muted truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="group flex items-center justify-between w-full p-2.5 rounded-xl text-dash-text hover:bg-dash-bg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-dash-bg rounded-lg group-hover:bg-white transition-colors">
                        <UserIcon className="w-4 h-4 text-dash-muted group-hover:text-dash-accent" />
                      </div>
                      <span className="text-sm font-medium text-dash-text">
                        View Profile
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-dash-muted opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                  </Link>

                  {/* <Link
                    to="/dashboard"
                    onClick={() => setShowUserDropdown(false)}
                    className="group flex items-center justify-between w-full p-2.5 rounded-xl text-dash-text hover:bg-dash-bg transition-all mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-dash-bg rounded-lg group-hover:bg-white transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-dash-muted group-hover:text-dash-accent" />
                      </div>
                      <span className="text-sm font-medium text-dash-text">
                        Dashboard
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-dash-muted opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                  </Link> */}

                  <div className="h-px bg-dash-border/50 my-2 mx-2" />

                  <button
                    onClick={handleLogout}
                    className="group flex items-center justify-between w-full p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg group-hover:bg-white transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Logout</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
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
        className={`md:hidden absolute top-16 left-0 right-0 bg-brand-navy/95 border-b border-brand-border transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-120 opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 flex flex-col gap-2">
          <a
            href="https://test.thenovagroupco.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Home
          </a>
          <a
            href="https://test.thenovagroupco.com/packages"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-brand-blue-light p-3 rounded-lg hover:bg-white/5 transition-colors [&.active]:text-brand-blue [&.active]:font-bold"
          >
            Packages
          </a>
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
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500/50 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
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
