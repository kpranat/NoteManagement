import { Search, Bell, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
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

        <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium overflow-hidden border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-within:ring-offset-2">
          {/* User avatar dropdown later */}
          <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=f4f4f5`} 
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
