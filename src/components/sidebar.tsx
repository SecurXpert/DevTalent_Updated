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
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
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
    // { name: "Notifications", icon: Bell, path: "/notifications" },
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
    const handleToggleDesktopSidebar = () => {
      setIsDesktopCollapsed((prev) => !prev);
    };

    window.addEventListener("toggleSidebar", handleToggleSidebar);
    window.addEventListener("toggleDesktopSidebar", handleToggleDesktopSidebar);
    return () => {
      window.removeEventListener("toggleSidebar", handleToggleSidebar);
      window.removeEventListener("toggleDesktopSidebar", handleToggleDesktopSidebar);
    };
  }, []);

  const toggleDesktop = () => {
    window.dispatchEvent(new CustomEvent("toggleDesktopSidebar"));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminlogin");
    window.scrollTo(0, 0);
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
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-[#f8f8f8] border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:relative lg:h-full lg:transform-none ${isMobileMenuOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
          } ${isDesktopCollapsed
            ? "w-[240px] sm:w-[260px] md:w-[200px] lg:w-[80px] xl:w-[80px]"
            : "w-[240px] sm:w-[260px] md:w-[200px] lg:w-[220px] xl:w-[240px]"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-[60px] sm:h-[65px] md:h-[50px] lg:h-[55px] xl:h-[66px] border-b border-gray-200 px-3 sm:px-4 md:px-2 lg:px-3 xl:px-4">
            <div className={`text-center leading-none flex-1 ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
              <img
                src="/img/Logo.svg"
                alt="Devtalent Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 mx-auto"
              />
            </div>
            {/* Desktop Collapse Button */}
            <button
              onClick={toggleDesktop}
              className={`hidden lg:flex p-1 rounded-md hover:bg-gray-200 text-gray-600 transition-colors ${isDesktopCollapsed ? "mx-auto" : ""}`}
            >
              {isDesktopCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden ml-auto p-2 rounded-lg hover:bg-gray-100"
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
                    className={`flex w-full items-center gap-2 sm:gap-3 md:gap-2 lg:gap-2 xl:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-2 lg:px-3 xl:px-4 py-3 sm:py-3 md:py-2 lg:py-2 xl:py-3 text-left transition-all ${isActive(item.path) ? "text-white" : "text-[#3f4a5f] hover:bg-white"
                      } ${isDesktopCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                    style={{
                      background: isActive(item.path)
                        ? "linear-gradient(90deg, #8020A9 0%, #3B309E 100%)"
                        : "transparent",
                    }}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ${isDesktopCollapsed ? "lg:w-6 lg:h-6" : ""}`}
                      strokeWidth={2}
                    />
                    <span className={`text-[12px] sm:text-[13px] md:text-[11px] lg:text-[12px] xl:text-[13px] font-medium ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex w-full items-center gap-2 sm:gap-3 md:gap-2 lg:gap-2 xl:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-2 lg:px-3 xl:px-4 py-3 sm:py-3 md:py-2 lg:py-2 xl:py-3 text-left transition-all text-red-600 hover:bg-red-50 ${isDesktopCollapsed ? "lg:justify-center lg:px-0" : ""
                }`}
            >
              <LogOut
                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ${isDesktopCollapsed ? "lg:w-6 lg:h-6" : ""
                  }`}
                strokeWidth={2}
              />
              <span
                className={`text-[12px] sm:text-[13px] md:text-[11px] lg:text-[12px] xl:text-[13px] font-medium ${isDesktopCollapsed ? "lg:hidden" : ""
                  }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
