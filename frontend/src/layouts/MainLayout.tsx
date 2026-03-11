import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StarField from "../components/StarField";

export default function MainLayout() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-background text-foreground relative">
      {/* Star field — dark mode only */}
      {isDark && <StarField />}

      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Navbar />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="w-full max-w-[1200px] mx-auto px-6 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
