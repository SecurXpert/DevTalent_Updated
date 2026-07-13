import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  useEffect(() => {
    const handleToggleDesktopSidebar = () => setIsDesktopCollapsed(prev => !prev);
    window.addEventListener("toggleDesktopSidebar", handleToggleDesktopSidebar);
    return () => window.removeEventListener("toggleDesktopSidebar", handleToggleDesktopSidebar);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3ff] lg:flex">
      {/* Desktop Sidebar - Fixed */}
      <div className="fixed inset-y-0 left-0 z-40 lg:block hidden">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - Overlay */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
        isDesktopCollapsed ? "lg:ml-[80px] xl:ml-[80px]" : "lg:ml-[220px] xl:ml-[240px]"
      }`}>
        <Header />
        <main className="p-2 sm:p-3 md:p-3 lg:p-4 xl:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
