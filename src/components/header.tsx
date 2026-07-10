import { Search, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { profileData } = useProfile();

  const toggleSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // This will be handled by the sidebar component
    window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border border-gray-200 rounded-none px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex items-center justify-between shadow-sm">
      {/* Left Section - Menu Button + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        {/* Sidebar Toggle Button - Visible on small screens */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={18} className="text-gray-700" />
        </button>

        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[860px] h-8 sm:h-9 md:h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 md:px-6">
          <Search className="text-gray-400 mr-2 sm:mr-3" size={14} />
          <input
            type="text"
            placeholder="Search students, exams, results..."
            className="flex-1 bg-transparent rounded-lg outline-none text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-slate-500 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 ml-3 sm:ml-4 md:ml-6">
        {/* Notifications */}
        <div className="relative pr-3 sm:pr-4 md:pr-6 border-r border-gray-200">
          <Bell className="text-slate-600" size={16} />
          <span className="absolute top-0 right-2 sm:right-3 md:right-5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full border border-white sm:border-2"></span>
        </div>

        {/* User Profile */}
        <div
          onClick={() => navigate("/profile-settings")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center text-white shadow-md">
            <User size={12} />
          </div>
          <div className="hidden sm:block">
            <h3 className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-slate-800 leading-none">
              {profileData.fullName}
            </h3>
            <p className="text-[10px] sm:text-[11px] md:text-[13px] text-slate-500 hidden md:block">
              {profileData.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
