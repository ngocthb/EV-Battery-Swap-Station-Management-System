import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface UserDistributionChartProps {
  heading: string;
  subHeading?: string;
}

// Dữ liệu phân bố người dùng
const data = [
  { name: "Người dùng Premium", value: 2318, color: "#3b82f6" },
  { name: "Người dùng Miễn phí", value: 1256, color: "#1f2937" },
  { name: "Người dùng Thử nghiệm", value: 456, color: "#6b7280" },
  { name: "Không hoạt động", value: 234, color: "#d1d5db" },
];

const UserDistributionChart: React.FC<UserDistributionChartProps> = ({
  heading,
  subHeading,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 transition-colors duration-300 hover:border-gray-300">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{heading}</h3>
        {subHeading && (
          <p className="text-sm text-gray-500 mt-1">{subHeading}</p>
        )}
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                color: "black",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ color: "#374151" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserDistributionChart;
