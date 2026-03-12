import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Files, 
  PlusCircle, 
  LayoutTemplate, 
  LineChart, 
  CreditCard, 
  Settings, 
  LogOut,
  ShieldCheck,
  Users
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Notes", href: "/notes", icon: Files },
  { name: "Create Note", href: "/notes/create", icon: PlusCircle },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Insights", href: "/insights", icon: LineChart },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

const RECENT_NOTES = [
  { id: 1, title: "Product Requirements", type: "General" },
  { id: 2, title: "DBMS Study Guide", type: "Study" },
  { id: 3, title: "Weekly Planning", type: "Todo" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col h-full flex-shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-900 dark:text-primary">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
          SmartNotes
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
          
          {/* Admin Panel Link - Only visible to admins */}
          {isAdmin && (
            <>
              <div className="h-px bg-border my-2" />
              <NavLink
                to="/admin"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                    : "text-muted-foreground hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        {/* Recent Notes */}
        <div>
          <h4 className="px-3 text-xs font-extrabold text-zinc-700 dark:text-zinc-200 uppercase tracking-widest mb-2">
            Recent Notes
          </h4>
          <div className="space-y-1">
            {RECENT_NOTES.map((note) => (
              <NavLink
                key={note.id}
                to={`/notes/${note.id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-zinc-800 dark:text-zinc-100 font-semibold hover:bg-secondary hover:text-foreground transition-colors truncate"
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="truncate">{note.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
            {user?.username ? (
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}&backgroundColor=f4f4f5`} 
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              'U'
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{user?.username || 'User'}</p>
              {isAdmin && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user?.subscription_plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
