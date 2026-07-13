import { TabButtonProps } from "./types";

const TabButton = ({ label, active, onClick }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 xs:px-4 sm:px-5 py-3 xs:py-4 text-[11px] xs:text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition ${
        active ? "text-[#4f46e5]" : "text-slate-600 hover:text-slate-800"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#4f46e5]" />
      )}
    </button>
  );
};

export default TabButton;
