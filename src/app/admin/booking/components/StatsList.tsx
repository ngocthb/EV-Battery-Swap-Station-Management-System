import { Box } from "lucide-react";
import { BatteryType, Booking } from "@/types";

function StatsList({ bookingList }: { bookingList: Booking[] }) {
  const stats = [
    {
      label: "Tổng loại pin",
      icon: <Box className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
      value: bookingList?.length || 0,
    },
    {
      label: "Hoạt động",
      icon: <Box className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-100",
      value: bookingList?.filter((c) => c?.status === "COMPLETED").length || 0,
    },
    {
      label: "Ngưng hoạt động",
      icon: <Box className="w-6 h-6 text-red-600" />,
      bgColor: "bg-red-100",
      value: bookingList?.filter((c) => c?.status === "CANCELED").length || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>{item.icon}</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsList;
