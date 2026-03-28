import { Bell, ChevronDown, LogOut, User, Menu } from "lucide-react";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { cn } from "../../lib/utils";
import { useUserData } from "../../features/auth/useUserData";

interface AuthNavbarProps {
  onMenuClick?: () => void;
}

export function AuthNavbar({ onMenuClick }: AuthNavbarProps) {
  const { logout } = useAuthStore();
  const { data: user, isLoading } = useUserData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { location } = useRouterState();

  // console.log("user is ", user);

  const getTitle = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0 || parts[0] === "dashboard") return "Dashboard";
    return (
      parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace("-", " ")
    );
  };

  const title = getTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  if (isLoading) {
    return null;
  }

  return (
    <header className="h-16 bg-dash-sidebar border-b border-dash-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-dash-muted hover:text-dash-accent hover:bg-dash-bg rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold text-dash-text">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-dash-muted hover:text-dash-accent hover:bg-dash-bg rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-dash-sidebar rounded-full" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-dash-bg transition-colors"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-dash-border">
              <img
                src={user?.["user data"].image ?? "/images/default-avatar.png"}
                alt={user?.["user data"].first_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/images/default-avatar.png";
                }}
              />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-dash-text leading-tight">
                {user?.["user data"].first_name} {user?.["user data"].last_name}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "text-dash-muted transition-transform duration-200",
                isDropdownOpen ? "rotate-180" : "",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-dash-sidebar border border-dash-border rounded-xl shadow-lg py-2 z-20">
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dash-text hover:bg-dash-bg transition-colors"
                >
                  <User size={16} className="text-dash-muted" /> Profile
                </Link>
                <hr className="my-1 border-dash-border" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
