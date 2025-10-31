import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  heading: string;
  subHeading?: string;
}

// Dữ liệu mẫu
const data = [
  { name: "T2", revenue: 4000 },
  { name: "T3", revenue: 3000 },
  { name: "T4", revenue: 2000 },
  { name: "T5", revenue: 2780 },
  { name: "T6", revenue: 1890 },
  { name: "T7", revenue: 2390 },
  { name: "CN", revenue: 3490 },
];

const RevenueChart: React.FC<RevenueChartProps> = ({ heading, subHeading }) => {
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
          <BarChart data={data}>
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
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
