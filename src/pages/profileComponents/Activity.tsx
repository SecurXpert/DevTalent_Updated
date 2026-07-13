import {
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineBuildingOffice2,
  HiOutlineArrowUpTray,
} from "react-icons/hi2";
import ActivityRow from "./ActivityRow";

const Activity = () => {
  return (
    <div className="space-y-4">
      <ActivityRow
        icon={<HiOutlineCheckCircle className="text-[#16a34a] text-[22px]" />}
        iconBg="bg-[#dcfce7]"
        title='Created new exam "Advanced Data Structures"'
        time="2 hours ago"
        ip="192.168.1.1"
      />
      <ActivityRow
        icon={<HiOutlineUser className="text-[#2563eb] text-[22px]" />}
        iconBg="bg-[#dbeafe]"
        title='Updated student profile for "John Smith"'
        time="5 hours ago"
        ip="192.168.1.1"
      />
      <ActivityRow
        icon={<HiOutlineLockClosed className="text-[#9333ea] text-[22px]" />}
        iconBg="bg-[#f3e8ff]"
        title="Changed account password"
        time="1 day ago"
        ip="192.168.1.1"
      />
      <ActivityRow
        icon={
          <HiOutlineBuildingOffice2 className="text-[#4f46e5] text-[22px]" />
        }
        iconBg="bg-[#e0e7ff]"
        title='Created new subscription plan "Enterprise Plus"'
        time="2 days ago"
        ip="192.168.1.1"
      />
      <ActivityRow
        icon={<HiOutlineArrowUpTray className="text-[#d97706] text-[22px]" />}
        iconBg="bg-[#fef3c7]"
        title="Exported student results report"
        time="3 days ago"
        ip="192.168.1.1"
      />

      <div className="pt-8 text-center">
        <button className="text-[#4f46e5] font-medium hover:underline">
          Load More Activity
        </button>
      </div>
    </div>
  );
};

export default Activity;
