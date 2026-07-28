import React from "react";
import { FiUser, FiMail, FiPhone, FiHome, FiBookOpen, FiEdit2 } from "react-icons/fi";

const InputField = ({
  label,
  name,
  value,
  icon,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <p className="text-gray-500 mb-1 text-sm flex items-center gap-2">
      <span className="text-purple-600">{icon}</span>
      {label}
    </p>
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3">
      <input
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="w-full py-2 bg-transparent outline-none text-sm"
      />
    </div>
  </div>
);

interface ProfileInfoTabProps {
  form: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  handleSaveProfile: () => void;
  courses: string[];
  toggleCourse: (course: string) => void;
  subscriptionData?: any;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  form,
  handleChange,
  isEdit,
  setIsEdit,
  handleSaveProfile,
  courses,
  toggleCourse,
  subscriptionData,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Personal Information</h3>
        <button
          onClick={() => setIsEdit(!isEdit)}
          className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm flex items-center gap-1"
        >
          <FiEdit2 /> {isEdit ? "Cancel" : "Edit"}
        </button>
      </div>

      <InputField
        label="Full Name"
        name="fullName"
        value={form.fullName}
        disabled={!isEdit}
        onChange={handleChange}
        icon={<FiUser />}
      />

      <InputField
        label="Email ID"
        name="email"
        value={form.email}
        disabled
        icon={<FiMail />}
      />

      <InputField
        label="Phone Number"
        name="phone"
        value={form.phone}
        disabled={!isEdit}
        onChange={handleChange}
        icon={<FiPhone />}
      />

      <InputField
        label="College Name"
        name="college"
        value={form.college}
        disabled={!isEdit}
        onChange={handleChange}
        icon={<FiHome />}
      />

      {/* COURSE BUTTONS */}
      <div>
        {/* TITLE WITH ICON */}
        <div className="flex items-center gap-2 mb-2">
          <FiBookOpen className="text-purple-600" />
          <p className="text-gray-500 text-sm">Courses Opted</p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-2">
          {subscriptionData?.selected_courses && subscriptionData.selected_courses.length > 0 ? (
            subscriptionData.selected_courses.map((c: any) => (
              <span
                key={c.course_id}
                className="px-3 py-1 text-xs rounded-full border border-purple-600 bg-white text-purple-600"
              >
                {c.course_name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No courses opted yet</span>
          )}
        </div>

        {/* HELP TEXT */}
        <p className="text-xs text-gray-400 mt-1">
          To change courses, upgrade your subscription
        </p>
      </div>

      {isEdit && (
        <button
          onClick={handleSaveProfile}
          className="w-full bg-gradient-to-r from-purple-700 to-purple-600 text-white py-2 rounded-lg"
        >
          💾 Save Changes
        </button>
      )}
    </div>
  );
};
