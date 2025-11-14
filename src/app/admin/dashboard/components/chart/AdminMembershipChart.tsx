import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getDashboardUserMembershipAPI } from "@/services/dashboardService";

const COLORS = ["#d1d5db", "#3b82f6", "#fbbf24", "#10b981", "#8b5cf6"];

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

const AdminMembershipChart = () => {
  const [chartData, setChartData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [stats, setStats] = useState<MembershipData | null>(null);

  const fetchMembershipData = async (
    selectedMonth: number,
    selectedYear: number
  ) => {
    try {
      setLoading(true);
      console.log(
        "📊 [Membership] Fetching data for",
        selectedMonth,
        "/",
        selectedYear
      );
      const res = await getDashboardUserMembershipAPI({
        month: selectedMonth,
        year: selectedYear,
      });
      const data: MembershipData = res?.data;
      console.log("📊 [Membership] Received data:", data);

      if (data) {
        setStats(data);

        // Build chart data - always show all memberships in legend
        const formatted: { name: string; value: number; color: string }[] = [];

        // Add users without membership
        formatted.push({
          name: "Không có gói",
          value: data.usersWithoutMembership,
          color: "#d1d5db",
        });

        // Add all membership stats (always include in legend even if count is 0)
        data.membershipStats.forEach((stat, index) => {
          formatted.push({
            name: stat.membershipName,
            value: stat.userCount,
            color: COLORS[(index + 1) % COLORS.length],
          });
        });

        console.log("📊 [Membership] Formatted data:", formatted);
        setChartData(formatted);
      }
    } catch (error) {
      console.error("❌ [Membership] Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipData(month, year);
  }, [month, year]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 transition-colors duration-300 hover:border-gray-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Đăng ký thành viên
            </h3>
            {stats && (
              <p className="text-sm text-gray-500 mt-1">
                Tổng: {stats.totalUsers} người dùng
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700"
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Không có dữ liệu thành viên</div>
          </div>
        ) : (
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

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  color: "black",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value} người`, "Số lượng"]}
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
        )}
      </div>
    </div>
  );
};

export default AdminMembershipChart;
