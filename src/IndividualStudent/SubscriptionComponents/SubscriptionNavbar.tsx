import React from "react";
import Devlogo from "../../assests/Devlogo.png";

interface SubscriptionNavbarProps {
  userName: string;
  userEmail: string;
}

export const SubscriptionNavbar: React.FC<SubscriptionNavbarProps> = ({
  userName,
  userEmail,
}) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={Devlogo} alt="DevTalent" className="h-14" />
          </div>

          {/* User Info */}
          <div className="text-right">
            <p className="font-semibold text-gray-800">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
