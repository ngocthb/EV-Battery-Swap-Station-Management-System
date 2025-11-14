
import { getDashboardUserMembershipChartAPI } from "@/services/dashboardService";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";


interface MembershipStat {
  membershipId: number;
  membershipName: string;
  price: string;
  userCount: number;
}

interface MembershipData {
  totalUsers: number;
  usersWithoutMembership: number;
  usersWithMembership: number;
  membershipStats: MembershipStat[];
}

interface MembershipChartItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

const AdminMembershipChart = () => {

  const [chartData, setChartData] = useState<MembershipChartItem[]>([]);
  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2025);

  const fetchUserMembershipChart = async () => {
    try {
      const res = await getDashboardUserMembershipChartAPI({
        month: month,
        year: year,
      });

      const apiData = res.data;

      const formatted = [
        {
          name: "Miễn phí",
          value: apiData.usersWithoutMembership,
          color: "#d1d5db",
        },
        ...apiData.membershipStats.map((m: any) => ({
          name:
            m.membershipName === "Basic"
              ? "Cơ bản"
              : m.membershipName === "Premium"
              ? "Cao cấp"
              : m.membershipName === "VIP"
              ? "Vip"
              : "Miễn phí",
          value: m.userCount,
          color:
            m.membershipName === "Basic"
              ? "black"
              : m.membershipName === "Premium"
              ? "gold"
              : m.membershipName === "VIP"
              ? "#3b82f6"
              : "#ccc",
        })),
      ];

      setChartData(formatted);
    } catch (error) {
      console.log("fetch membership chart err", error);
    }
  };

  useEffect(() => {

    fetchUserMembershipChart();
  }, [month, year]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 transition-colors duration-300 hover:border-gray-300">

      <div className="mb-6 flex items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Đăng ký thành viên
        </h3>
        <div className="ml-auto gap-2 flex">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none bg-gray-100"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none bg-gray-100"
          >
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[300px] w-full">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminMembershipChart;
