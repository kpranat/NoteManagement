import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex bg-primary/5 flex-col justify-between p-12 border-r border-border/50 relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            SmartNotes
          </Link>
          <div className="mt-20">
            <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-4">
              Your smart workspace<br />for better thinking.
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm">
              Capture, organize, and transform your notes with intelligent tools designed for speed and clarity.
            </p>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
      </div>
      
      {/* Form Side */}
      <div className="flex bg-background items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
