import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  CreditCard,
  PieChart,
  Bell,
  Settings,
  Code,
  Menu,
  BookOpen,
  X,
  Shield,
} from "lucide-react";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem("userRole"); // "super_admin" or "admin"
  const dashboardPath = userRole === "super_admin" ? "/superadmindashboard" : "/admindashboard";

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: dashboardPath },
    { name: "Students", icon: Users, path: "/students" },
    { name: "Exams", icon: FileText, path: "/exams" },
      { name: "Courses", icon: BookOpen, path: "/courses" },
      { name: "Coding Languages", icon: Code, path: "/coding-languages" },
    { name: "Results", icon: BarChart3, path: "/results" },
    { name: "Subscriptions & Plans", icon: CreditCard, path: "/subscriptions" },
    { name: "Reports & Analytics", icon: PieChart, path: "/reports" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    ...(userRole === "super_admin"
      ? [{ name: "Admin Management", icon: Shield, path: "/admin-management" }]
      : []),
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  // Listen for custom event from header
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };

    window.addEventListener("toggleSidebar", handleToggleSidebar);
    return () =>
      window.removeEventListener("toggleSidebar", handleToggleSidebar);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] sm:w-[260px] md:w-[200px] lg:w-[220px] xl:w-[240px] h-screen bg-[#f8f8f8] border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:h-full lg:transform-none ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-[60px] sm:h-[65px] md:h-[50px] lg:h-[55px] xl:h-[66px] border-b border-gray-200 px-3 sm:px-4 md:px-2 lg:px-3 xl:px-4">
          <div className="text-center leading-none flex-1">
            <img
              src="/img/Logo.svg"
              alt="Devtalent Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 mx-auto"
            />
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-2 lg:px-3 xl:px-4 py-4 sm:py-5 md:py-3 lg:py-4 xl:py-5">
          <div className="flex flex-col gap-1 sm:gap-2 md:gap-1 lg:gap-1 xl:gap-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`flex w-full items-center gap-2 sm:gap-3 md:gap-2 lg:gap-2 xl:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-2 lg:px-3 xl:px-4 py-3 sm:py-3 md:py-2 lg:py-2 xl:py-3 text-left transition-all ${
                    isActive(item.path)
                      ? "text-white"
                      : "text-[#3f4a5f] hover:bg-white"
                  }`}
                  style={{
                    background: isActive(item.path)
                      ? "linear-gradient(90deg, #8020A9 0%, #3B309E 100%)"
                      : "transparent",
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5"
                    strokeWidth={2}
                  />
                  <span className="text-[12px] sm:text-[13px] md:text-[11px] lg:text-[12px] xl:text-[13px] font-medium">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      </aside>
    </>
  );
}
