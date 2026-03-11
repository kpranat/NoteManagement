import { useState } from "react";
import { User, Lock, Bell, Moon, Loader2 } from "lucide-react";

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Update user settings via backend
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account preferences and application settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg font-medium">
            <User className="w-4 h-4" /> Profile Information
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors">
            <Lock className="w-4 h-4" /> Change Password
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors">
            <Moon className="w-4 h-4" /> Appearance
          </button>
        </div>

        {/* Selected Section */}
        <div className="md:col-span-3 border border-border rounded-xl bg-card p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-sm font-medium overflow-hidden border-2 border-border relative group cursor-pointer">
                <img 
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=f4f4f5`} 
                  alt="User avatar"
                  className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                />
                <span className="absolute text-xs font-semibold opacity-0 group-hover:opacity-100 bg-background/80 px-2 py-1 rounded">Change</span>
              </div>
              <div>
                <button type="button" className="text-sm font-semibold bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors border border-border">
                  Upload Avatar
                </button>
                <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  defaultValue="John"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  defaultValue="Doe"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                defaultValue="john@example.com"
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background cursor-not-allowed opacity-50"
                disabled
              />
              <p className="text-xs text-muted-foreground">Your email cannot be changed.</p>
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-4">
              <button 
                type="button" 
                className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
