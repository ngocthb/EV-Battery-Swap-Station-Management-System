import { Box } from "lucide-react";
import { Cabinet, StationStaff } from "@/types";

function StatsList({ staffList }: { staffList: StationStaff[] }) {
  const stats = [
    {
      label: "Tổng nhân viên",
      icon: <Box className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
      value: staffList?.length || 0,
    },
    {
      label: "Trưởng trạm",
      icon: <Box className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-100",
      value: staffList?.filter((c) => c?.isHead === true).length || 0,
    },
    {
      label: "Nhân viên thường",
      icon: <Box className="w-6 h-6 text-red-600" />,
      bgColor: "bg-red-100",
      value: staffList?.filter((c) => c?.isHead === false).length || 0,
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
