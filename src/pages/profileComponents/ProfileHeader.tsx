import { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
  HiOutlinePencil,
} from "react-icons/hi2";
import { FiCamera } from "react-icons/fi";

interface ProfileData {
  fullName: string;
  email: string;
}

interface ProfileHeaderProps {
  profileData: ProfileData;
  onEdit?: () => void;
}

const ProfileHeader = ({ profileData, onEdit }: ProfileHeaderProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    // Trigger the PersonalInfo edit function
    if ((window as any).triggerPersonalInfoEdit) {
      (window as any).triggerPersonalInfoEdit();
    }
    // Also call the original onEdit if provided
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#dddde3] bg-white shadow-sm">
      <div className="h-8 xs:h-9 bg-gradient-to-r from-[#5f6cf7] via-[#9a42f3] to-[#ef2f8f] px-6 xs:px-6 py-5 flex items-center">
        <h2 className="text-white text-[20px] xs:text-[20px] font-semibold">
          {profileData.fullName}
        </h2>
      </div>

      <div className="flex flex-col gap-4 xs:gap-5 p-4 xs:p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 xs:gap-4 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative h-[72px] w-[72px] xs:h-[80px] xs:w-[80px] sm:h-[88px] sm:w-[88px] rounded-2xl bg-gradient-to-br from-[#5b63f6] to-[#9d1df5] shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <HiOutlineUser className="text-white text-[36px] xs:text-[42px] sm:text-[48px]" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image-upload"
            />
            <label
              htmlFor="profile-image-upload"
              className="absolute bottom-1 right-1 flex h-5 w-5 xs:h-6 xs:w-6 items-center justify-center rounded-lg bg-white shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <FiCamera className="text-[#7c3aed] text-[10px] xs:text-[12px]" />
            </label>
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[23px] font-semibold text-slate-800 break-words">
              Platform Administrator
            </h3>

            <div className="mt-2 xs:mt-3 flex flex-col gap-2 text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <div className="flex items-center gap-2 text-[12px] xs:text-[13px] sm:text-[14px]">
                <HiOutlineEnvelope className="text-[11px] xs:text-[12px] sm:text-[13px] flex-shrink-0" />
                <span className="break-words">{profileData.email}</span>
              </div>

              <div className="flex items-center gap-2 text-[12px] xs:text-[13px] sm:text-[14px]">
                <HiOutlineCalendarDays className="text-[11px] xs:text-[12px] sm:text-[13px] flex-shrink-0" />
                <span className="break-words">Joined March 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="self-start md:self-center">
          <button
            onClick={handleEditClick}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5f63f7] to-[#8d18f2] px-3 xs:px-4 py-2 text-white font-medium shadow-lg hover:opacity-95 text-[12px] xs:text-[14px]"
          >
            <HiOutlinePencil className="text-[14px] xs:text-[16px]" />
            <span className="">Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
