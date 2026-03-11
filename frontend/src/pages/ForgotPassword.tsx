import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Connect to password reset endpoint
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 800);
  };

  if (isSent) {
    return (
      <div className="flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-300 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Check your email</h2>
          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
            We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>
        <div className="pt-4">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Forgot password?</h2>
        <p className="text-sm text-muted-foreground">
          No worries, we'll send you reset instructions.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
        </button>
      </form>

      <div className="px-8 text-center text-sm text-muted-foreground">
        <Link to="/login" className="inline-flex items-center hover:text-primary underline underline-offset-4 font-medium transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
