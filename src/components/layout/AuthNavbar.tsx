import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Menu,
  LayoutDashboard,
} from "lucide-react";
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
              <div className="absolute right-0 mt-2 w-64 bg-dash-sidebar border border-dash-border rounded-2xl shadow-xl p-2 z-20 animate-in fade-in zoom-in duration-200">
                {/* User Header */}
                <div className="flex items-center gap-3 p-3 border-b border-dash-border/50 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-dash-bg border border-dash-border flex items-center justify-center shrink-0">
                    <img
                      src={
                        user?.["user data"].image ??
                        "/images/default-avatar.png"
                      }
                      alt={user?.["user data"].first_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-sm font-bold !text-dash-text truncate">
                      {user?.["user data"].first_name}{" "}
                      {user?.["user data"].last_name}
                    </span>
                    <span className="text-xs text-dash-muted truncate">
                      {user?.["user data"].email}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="group flex items-center justify-between w-full p-2.5 rounded-xl text-dash-text hover:bg-dash-bg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-dash-bg rounded-lg group-hover:bg-white transition-colors">
                      <User
                        size={16}
                        className="text-dash-muted group-hover:text-dash-accent"
                      />
                    </div>
                    <span className="text-sm font-medium">View Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dash-muted opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="group flex items-center justify-between w-full p-2.5 rounded-xl text-dash-text hover:bg-dash-bg transition-all mt-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-dash-bg rounded-lg group-hover:bg-white transition-colors">
                      <LayoutDashboard
                        size={16}
                        className="text-dash-muted group-hover:text-dash-accent"
                      />
                    </div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dash-muted opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                </Link>

                <div className="h-px bg-dash-border/50 my-2 mx-2" />

                <button
                  onClick={handleLogout}
                  className="group flex items-center justify-between w-full p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg group-hover:bg-white transition-colors">
                      <LogOut size={16} />
                    </div>
                    <span className="text-sm font-medium">Logout</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
