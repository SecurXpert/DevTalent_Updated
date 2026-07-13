import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ProfileHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-8 md:px-10 md:py-10">
      <button
        onClick={() => {
          navigate("/studentdashboard");
          window.scrollTo(0, 0);
        }}
        className="flex items-center gap-2 text-sm mb-6 hover:opacity-80"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl md:text-3xl font-bold">Profile & Settings</h1>
      <p className="text-sm opacity-90 mt-1">
        Manage your account and preferences
      </p>
    </div>
  );
};
