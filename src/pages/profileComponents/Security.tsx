import {
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineComputerDesktop,
  HiOutlineDevicePhoneMobile,
} from "react-icons/hi2";
import InputField from "./InputField";
import SessionCard from "./SessionCard";

const Security = () => {
  return (
    <div className="space-4 xs:space-5">
      {/* Change Password */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-[#fbfbfd] p-4 xs:p-5">
        <div className="mb-4 xs:mb-5 flex items-start gap-3 xs:gap-4">
          <div className="flex h-8 w-8 xs:h-10 xs:w-10 items-center justify-center rounded-xl bg-[#ecebff] flex-shrink-0">
            <HiOutlineLockClosed className="text-[#5b63f6] text-[18px] xs:text-[20px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-slate-800 break-words">
              Change Password
            </h3>
            <p className="text-slate-500 text-[11px] xs:text-[13px] mt-1">
              Update your password regularly to keep your account secure
            </p>
          </div>
        </div>

        <div className="space-4 xs:space-5">
          <InputField
            label="Current Password"
            placeholder="Enter current password"
          />
          <div className="grid grid-cols-1 gap-4 xs:gap-5 md:grid-cols-2 mt-4">
            <InputField label="New Password" placeholder="Enter new password" />
            <InputField
              label="Confirm New Password"
              placeholder="Re-enter new password"
            />
          </div>

          <button className="rounded-xl bg-[#5b63f6] px-4 xs:px-5 py-2 text-white font-medium shadow hover:opacity-95 text-[12px] xs:text-[14px] mt-4">
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="flex flex-col gap-3 xs:gap-4 rounded-2xl border border-[#e5e7eb] bg-[#fbfbfd] p-4 xs:p-5 sm:flex-row sm:items-center sm:justify-between mt-6">
        <div className="flex items-start gap-3 xs:gap-4">
          <div className="flex h-8 w-8 xs:h-10 xs:w-10 items-center justify-center rounded-xl bg-[#d9f8e4] flex-shrink-0">
            <HiOutlineShieldCheck className="text-[#16a34a] text-[18px] xs:text-[20px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-slate-800 break-words">
              Two-Factor Authentication
            </h3>
            <p className="text-slate-500 text-[11px] xs:text-[13px] mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

        <button className="rounded-xl bg-[#16a34a] px-4 xs:px-5 py-2 text-white font-medium shadow hover:opacity-95 self-start sm:self-auto text-[12px] xs:text-[14px]">
          Enable 2FA
        </button>
      </div>

      {/* Active Sessions */}
      <div className="mt-6">
        <h3 className="mb-3 xs:mb-4 text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-slate-800">
          Active Sessions
        </h3>

        <div className="space-3 xs:space-4">
          <SessionCard
            icon={
              <HiOutlineComputerDesktop className="text-[#2563eb] text-[18px] xs:text-[20px]" />
            }
            iconBg="bg-[#dbeafe]"
            device="MacBook Pro - Chrome"
            location="San Francisco, CA"
            time="Active now"
            badgeText="Current"
            badgeClass="bg-[#dcfce7] text-[#16a34a]"
          />

          <SessionCard
            icon={
              <HiOutlineDevicePhoneMobile className="text-[#9333ea] text-[18px] xs:text-[20px]" />
            }
            iconBg="bg-[#f3e8ff]"
            device="iPhone 15 - Safari"
            location="San Francisco, CA"
            time="2 hours ago"
            badgeText="Revoke"
            badgeClass="text-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Security;
