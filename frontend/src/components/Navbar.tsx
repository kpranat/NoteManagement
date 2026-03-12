import { Search, Bell, Sparkles, LogOut, User as UserIcon, Settings, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 flex-shrink-0 border-b border-border bg-background flex items-center px-6 justify-between sticky top-0 z-10 w-full">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search notes... (Press Cmd+K)"
            className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all"
          />
          {/* TODO: Connect to backend search endpoint */}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
          <Sparkles className="w-4 h-4" />
          AI Assistant
        </button>

        <Link 
          to="/subscription"
          className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        >
          Upgrade to Premium
        </Link>
        
        <div className="h-6 w-px bg-border mx-2" />

        <ThemeToggle />

        <div className="h-6 w-px bg-border mx-2" />

        <button aria-label="Notifications" className="relative p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium overflow-hidden border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:ring-2 hover:ring-ring transition-all"
          >
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'User'}&backgroundColor=f4f4f5`} 
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{user?.username}</p>
                  {isAdmin && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="text-xs font-semibold">Admin</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              
              <div className="py-2">
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
