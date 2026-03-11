import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="h-screen flex overflow-hidden bg-background text-foreground">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full max-w-[1200px] mx-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
