import React, { FormEvent } from "react";
import { User, Phone, Mail, GraduationCap, BookOpen } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface RegistrationFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  error: string;
  loading: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleCourseChange: (value: string) => void;
  navigate: NavigateFunction;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  setFormData,
  error,
  loading,
  handleSubmit,
  handleCourseChange,
  navigate,
}) => {
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={16} className="text-purple-600" />
            Full Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            required
            maxLength={50}
            value={formData.fullName}
            onChange={(e) => {
              let value = e.target.value;

              if (/^[A-Za-z\s]*$/.test(value)) {
                value = value.replace(/\s{2,}/g, " ");
                if (!value.startsWith(" ")) {
                  setFormData((prev: any) => ({
                    ...prev,
                    fullName: value,
                  }));
                }
              }
            }}
            onBlur={(e) => {
              setFormData((prev: any) => ({
                ...prev,
                fullName: e.target.value.trim(),
              }));
            }}
            placeholder="Enter your full name"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />

          {formData.fullName &&
            (formData.fullName.length < 2 ||
              !/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(formData.fullName)) && (
              <p className="text-red-500 text-xs mt-1">
                Name must be 2–50 letters only.
              </p>
            )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone size={16} className="text-purple-600" />
            Phone Number <span className="text-red-500">*</span>
          </label>

          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              if (onlyNumbers.length <= 10) {
                setFormData((prev: any) => ({
                  ...prev,
                  phone: onlyNumbers,
                }));
              }
            }}
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]{10}"
            placeholder="Enter 10 digit phone number"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />

          {formData.phone && formData.phone.length !== 10 && (
            <p className="text-red-500 text-xs mt-1">
              Phone number must be exactly 10 digits.
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mail size={16} className="text-purple-600" />
            Email ID <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => {
              const value = e.target.value;
              if (!value.includes(" ")) {
                setFormData((prev: any) => ({
                  ...prev,
                  email: value,
                }));
              }
            }}
            onBlur={(e) => {
              setFormData((prev: any) => ({
                ...prev,
                email: e.target.value.trim(),
              }));
            }}
            placeholder="your.email@example.com"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />

          {formData.email &&
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
              formData.email,
            ) && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid email address.
              </p>
            )}
        </div>

        {/* College */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <GraduationCap size={16} className="text-purple-600" />
            College Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            required
            maxLength={60}
            value={formData.college}
            onChange={(e) => {
              let value = e.target.value;

              if (/^[A-Za-z.,\s]*$/.test(value)) {
                value = value.replace(/\s{2,}/g, " ");
                if (!value.startsWith(" ")) {
                  setFormData((prev: any) => ({
                    ...prev,
                    college: value,
                  }));
                }
              }
            }}
            onBlur={(e) => {
              setFormData((prev: any) => ({
                ...prev,
                college: e.target.value.trim(),
              }));
            }}
            placeholder="Enter your college name"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />

          {formData.college &&
            !/^[A-Za-z.,]+(?:\s[A-Za-z.,]+)*$/.test(formData.college) && (
              <p className="text-red-500 text-xs mt-1">
                Only letters, spaces, "." and "," allowed.
              </p>
            )}
        </div>

        {/* Courses */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookOpen size={16} className="text-purple-600" />
            Courses Opted <span className="text-red-500">*</span>
          </label>

          <div className="mt-2 space-y-3">
            {/* Technical */}
            <div
              onClick={() => handleCourseChange("Technical")}
              className={`p-3 rounded-lg border cursor-pointer transition ${
                formData.courses.includes("Technical")
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.courses.includes("Technical")}
                  readOnly
                  className="accent-purple-600"
                />
                <div>
                  <p className="font-medium text-sm">Technical</p>
                  <p className="text-xs text-gray-500">
                    Programming, Data Structures, Algorithms
                  </p>
                </div>
              </div>
            </div>

            {/* Non Technical */}
            <div
              onClick={() => handleCourseChange("Non-Technical")}
              className={`p-3 rounded-lg border cursor-pointer transition ${
                formData.courses.includes("Non-Technical")
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.courses.includes("Non-Technical")}
                  readOnly
                  className="accent-purple-600"
                />
                <div>
                  <p className="font-medium text-sm">Non-Technical</p>
                  <p className="text-xs text-gray-500">
                    Aptitude, Reasoning, Verbal Ability
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Note */}
        <div className="bg-purple-50 border border-purple-200 text-xs text-gray-600 p-3 rounded-lg">
          <span className="text-purple-600 font-medium">Note:</span> A
          temporary password will be sent to your registered email.
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] text-white py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Redirect */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/individual")}
            className="ml-1 text-purple-600 hover:underline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
