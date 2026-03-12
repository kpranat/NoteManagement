import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Loader2, ShieldCheck, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate fields locally
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, name, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">
          Enter your information below to create your workspace.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm font-medium bg-destructive/10 text-destructive rounded-md flex items-center">
             {error}
          </div>
        )}
        
        <div className="space-y-2 relative">
          <label className="text-sm font-medium leading-none" htmlFor="name">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2 relative">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
        </button>
      </form>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Link
        to="/login"
        className="inline-flex items-center justify-center w-full h-10 px-4 rounded-md border border-border bg-transparent text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/40 transition-all"
      >
        Already have an account? &nbsp;<span className="text-primary font-semibold">Click to sign in</span>
      </Link>

      {/* Account Type Information */}
      <div className="mt-6 space-y-3">
        <div className="p-3 rounded-lg border border-border bg-secondary/30">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                New accounts are created as <span className="font-semibold text-foreground">Regular Users</span> with 
                full access to notes management and personal features.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                <span className="font-semibold">Admin Access:</span> Requires approval from system administrators. 
                Contact your administrator if you need elevated permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
