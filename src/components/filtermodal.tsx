import { ChevronDown } from "lucide-react";

type FilterModalProps = {
  isOpen?: boolean;
};

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
};

function SelectField({ label, value, options }: SelectFieldProps) {
  return (
    <div className="min-w-0">
      <label className="mb-3 block text-[15px] font-medium text-[#374151] sm:mb-3 sm:text-[14px] md:text-[15px] lg:text-[16px]">
        {label}
      </label>

      <div className="relative">
        <select
          defaultValue={value}
          className="h-[36px] w-full appearance-none rounded-[8px] border border-[#d9dde5] bg-white px-4 pr-10 text-[13px] text-[#111827] outline-none sm:h-[42px] sm:text-[14px] md:h-[44px]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]"
        />
      </div>
    </div>
  );
}

export default function FilterModal({ isOpen = true }: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="sm:mt-5 sm:mb-8 mt-6">
      <div className="w-full rounded-[14px] border border bg-white px-5 py-5 shadow-[0_2px_8px_rgba(15,23,42,0.08)] sm:px-4 sm:py-4">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SelectField
            label="Date Range"
            value="Today"
            options={[
              "Today",
              "Yesterday",
              "Last 7 Days",
              "Last 30 Days",
              "Month",
              "Year",
              "Week",
            ]}
          />

          <SelectField
            label="Course"
            value="All Courses"
            options={[
              "All Courses",
              "Computer Science",
              "Data Science",
              "Software Engineering",
              "Information Technology",
            ]}
          />

          <SelectField
            label="Exam Type"
            value="All Types"
            options={[
              "All Types",
              "Quiz",
              "Mid Term",
              "Final Exam",
              "Assignment",
            ]}
          />

          <SelectField
            label="Status"
            value="All Status"
            options={[
              "All Status",
              "Scheduled",
              "Active",
              "Completed",
              "Cancelled",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
