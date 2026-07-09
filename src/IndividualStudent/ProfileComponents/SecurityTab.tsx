import React from "react";
import { FiShield, FiLock, FiEye, FiEyeOff, FiLogOut } from "react-icons/fi";

interface SecurityTabProps {
  recentActivity: any;
  handleLogout: () => void;
  showPasswordFields: boolean;
  handleChangePassword: () => void;
  passwordData: any;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswords: any;
  togglePasswordVisibility: (field: "current" | "new" | "confirm") => void;
  passwordErrors: any;
  passwordSuccess: string;
  handlePasswordSubmit: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  recentActivity,
  handleLogout,
  showPasswordFields,
  handleChangePassword,
  passwordData,
  handlePasswordChange,
  showPasswords,
  togglePasswordVisibility,
  passwordErrors,
  passwordSuccess,
  handlePasswordSubmit,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h3 className="font-semibold flex items-center gap-2">
        <FiShield /> Security Settings
      </h3>

      {/* PASSWORD CARD */}
      <div className="bg-purple-50 rounded-lg p-4">
        <p className="font-medium">Password</p>
        <p className="text-sm text-gray-500">
          Keep your account secure by using a strong password
        </p>

        <button
          onClick={handleChangePassword}
          className="mt-3 w-full border rounded-lg py-2 flex items-center justify-center gap-2 bg-white"
        >
          {showPasswordFields ? "Cancel" : "Change Password"}
        </button>

        {/* Password Change Form */}
        {showPasswordFields && (
          <div className="mt-4 space-y-3">
            {/* Current Password */}
            <div>
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
                <FiLock className="w-3 h-3 text-purple-600" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.current && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.current}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
                <FiLock className="w-3 h-3 text-purple-600" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.new && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.new}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
                <FiLock className="w-3 h-3 text-purple-600" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.confirm && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm}</p>
              )}
            </div>

            {/* Success Message */}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                {passwordSuccess}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-gradient-to-r from-purple-700 to-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* ACCOUNT ACTIVITY */}
      <div className="bg-purple-50 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">Account Activity</p>
        <div className="flex justify-between">
          <span>Last Login</span>
          <span>
            {recentActivity?.logged_in_at
              ? new Date(recentActivity.logged_in_at).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Device</span>
          <span>{recentActivity?.device_name || "Unknown"}</span>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-red-100 border border-red-300 rounded-lg p-4">
        <p className="text-red-600 font-medium">Danger Zone</p>
        <p className="text-sm mb-2">Permanently log out from all devices</p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};
