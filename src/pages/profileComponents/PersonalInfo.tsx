import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import InputField from "./InputField";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
}

interface ValidationError {
  field: keyof ProfileData;
  message: string;
}

interface PersonalInfoProps {
  initialData: ProfileData;
  onUpdate: (data: ProfileData) => void;
  onEditingChange?: (isEditing: boolean) => void;
}

const PersonalInfo = ({ initialData, onUpdate, onEditingChange }: PersonalInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialData);
  const [tempData, setTempData] = useState<ProfileData>(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );

  useEffect(() => {
    setProfileData(initialData);
    setTempData(initialData);
    setValidationErrors([]);
  }, [initialData]);



  useEffect(() => {
    if (onEditingChange) {
      onEditingChange(isEditing);
    }
  }, [isEditing, onEditingChange]);

  useEffect(() => {
    (window as any).triggerPersonalInfoEdit = () => {
      setTempData(profileData);
      setValidationErrors([]);
      setIsEditing(true);
    };

    return () => {
      delete (window as any).triggerPersonalInfoEdit;
    };
  }, [profileData]);

  const validateField = (
    field: keyof ProfileData,
    value: string,
  ): string | null => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Full name must be at least 2 characters";
        if (value.trim().length > 50)
          return "Full name must be less than 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim()))
          return "Full name can only contain letters and spaces";
        return null;

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim()))
          return "Please enter a valid email address";
        return null;

      case "phone":
        if (value.trim()) {
          const phoneRegex = /^\d+$/;
          if (!phoneRegex.test(value.trim()))
            return "Phone number can only contain digits";
          if (value.trim().length < 10)
            return "Phone number must be at least 10 digits";
          if (value.trim().length > 15)
            return "Phone number must be less than 15 digits";
        }
        return null;

      case "role":
        if (!value.trim()) return "Role is required";
        if (value.trim().length < 2)
          return "Role must be at least 2 characters";
        if (value.trim().length > 50)
          return "Role must be less than 50 characters";
        return null;



      case "location":
        if (!value.trim()) return "Location is required";
        if (value.trim().length < 2)
          return "Location must be at least 2 characters";
        if (value.trim().length > 100)
          return "Location must be less than 100 characters";
        return null;

      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    const requiredFields: (keyof ProfileData)[] = [
      "fullName",
      "email",
      "role",
      "location",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, tempData[field]);
      if (error) {
        errors.push({ field, message: error });
      }
    });

    const optionalFields: (keyof ProfileData)[] = [
      "phone",
    ];

    optionalFields.forEach((field) => {
      if (tempData[field].trim()) {
        const error = validateField(field, tempData[field]);
        if (error) {
          errors.push({ field, message: error });
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const getFieldError = (field: keyof ProfileData): string | null => {
    const error = validationErrors.find((err) => err.field === field);
    return error ? error.message : null;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const newData = { ...tempData };
    setProfileData(newData);
    setIsEditing(false);
    setValidationErrors([]);
    onUpdate(newData);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setValidationErrors([]);
    setIsEditing(false);
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    const newValue = value;
    setTempData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    if (validationErrors.some((err) => err.field === field)) {
      setValidationErrors((prev) => prev.filter((err) => err.field !== field));
    }
  };

  return (
    <div className="space-y-4 xs:space-y-5">
      {/* Save/Cancel Buttons - Only show when editing */}
      {isEditing && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-xl border border-[#d1d5db] bg-white px-4 xs:px-5 py-2 text-slate-700 font-medium shadow hover:bg-gray-50 text-[12px] xs:text-[14px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-[#16a34a] px-4 xs:px-5 py-2 text-white font-medium shadow hover:opacity-95 text-[12px] xs:text-[14px]"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Validation Errors Summary */}
      {isEditing && validationErrors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 xs:p-4">
          <div className="flex items-start gap-2">
            <HiOutlineExclamationCircle className="text-red-500 text-[16px] xs:text-[18px] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-800 font-medium text-[13px] xs:text-[14px] mb-1">
                Please fix the following errors:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li
                    key={index}
                    className="text-red-700 text-[11px] xs:text-[12px]"
                  >
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xs:gap-5 md:grid-cols-2">
        <div>
          <InputField
            label="Full Name *"
            icon={<HiOutlineUser />}
            value={isEditing ? tempData.fullName : profileData.fullName}
            placeholder={isEditing ? "Enter your full name" : ""}
            readOnly={!isEditing}
            onChange={(e) =>
              isEditing && handleChange("fullName", e.target.value)
            }
          />
          {isEditing && getFieldError("fullName") && (
            <p className="mt-1 text-red-500 text-[11px] xs:text-[12px] flex items-center gap-1">
              <HiOutlineExclamationCircle className="text-[12px] xs:text-[13px]" />
              {getFieldError("fullName")}
            </p>
          )}
        </div>

        <div>
          <InputField
            label="Email Address *"
            icon={<HiOutlineEnvelope />}
            value={isEditing ? tempData.email : profileData.email}
            placeholder={isEditing ? "Enter your email address" : ""}
            readOnly={!isEditing}
            onChange={(e) => isEditing && handleChange("email", e.target.value)}
          />
          {isEditing && getFieldError("email") && (
            <p className="mt-1 text-red-500 text-[11px] xs:text-[12px] flex items-center gap-1">
              <HiOutlineExclamationCircle className="text-[12px] xs:text-[13px]" />
              {getFieldError("email")}
            </p>
          )}
        </div>

        <div>
          <InputField
            label="Phone Number"
            icon={<HiOutlinePhone />}
            value={isEditing ? tempData.phone : profileData.phone}
            placeholder={
              isEditing ? "Enter your phone number" : "No phone number added"
            }
            readOnly={!isEditing}
            onChange={(e) => isEditing && handleChange("phone", e.target.value)}
          />
          {isEditing && getFieldError("phone") && (
            <p className="mt-1 text-red-500 text-[11px] xs:text-[12px] flex items-center gap-1">
              <HiOutlineExclamationCircle className="text-[12px] xs:text-[13px]" />
              {getFieldError("phone")}
            </p>
          )}
        </div>

        <div>
          <InputField
            label="Role *"
            icon={<HiOutlineShieldCheck />}
            value={isEditing ? tempData.role : profileData.role}
            placeholder={isEditing ? "Enter your role" : ""}
            readOnly={!isEditing}
            onChange={(e) => isEditing && handleChange("role", e.target.value)}
          />
          {isEditing && getFieldError("role") && (
            <p className="mt-1 text-red-500 text-[11px] xs:text-[12px] flex items-center gap-1">
              <HiOutlineExclamationCircle className="text-[12px] xs:text-[13px]" />
              {getFieldError("role")}
            </p>
          )}
        </div>



        <div>
          <InputField
            label="Location *"
            icon={<HiOutlineMapPin />}
            value={isEditing ? tempData.location : profileData.location}
            placeholder={isEditing ? "Enter your location" : ""}
            readOnly={!isEditing}
            onChange={(e) =>
              isEditing && handleChange("location", e.target.value)
            }
          />
          {isEditing && getFieldError("location") && (
            <p className="mt-1 text-red-500 text-[11px] xs:text-[12px] flex items-center gap-1">
              <HiOutlineExclamationCircle className="text-[12px] xs:text-[13px]" />
              {getFieldError("location")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
