import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserGrowthChartProps {
  heading: string;
  subHeading?: string;
}

// Dữ liệu mẫu
const data = [
  { name: "Th1", users: 400, premium: 240 },
  { name: "Th2", users: 300, premium: 139 },
  { name: "Th3", users: 200, premium: 980 },
  { name: "Th4", users: 278, premium: 390 },
  { name: "Th5", users: 189, premium: 480 },
  { name: "Th6", users: 239, premium: 380 },
  { name: "Th7", users: 349, premium: 430 },
];

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                color: "black",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="premium"
              stroke="#1f2937"
              strokeWidth={3}
              dot={{ fill: "#1f2937", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#1f2937", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
