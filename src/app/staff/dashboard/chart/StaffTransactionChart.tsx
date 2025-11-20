import {
  getStaffDashboardTransactionChartAPI,
} from "@/services/dashboardService";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StaffTransactionChart = () => {
  const [chartData, setChartData] = useState<{ date: string; total: number }[]>(
    []
  );
  const today = new Date();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Format yyyy-mm-dd
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState<string>(formatDate(sevenDaysAgo));
  const [toDate, setToDate] = useState<string>(formatDate(today));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactionChartAPI = async () => {
    try {
      setLoading(true);

      const res = await getStaffDashboardTransactionChartAPI({
        from: fromDate,
        to: toDate,
      });

      const data = res?.data || [];

      setChartData(
        data.map((item: any) => ({
          date: item.date,
          total: item.total,
        }))
      );
    } catch (error) {
      console.error("❌ [Chart] Error fetching transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchTransactionChartAPI();
    }
  }, [fromDate, toDate]);

  return (
    <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6 transition-colors duration-300 hover:border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-md font-bold text-gray-900">Giao dịch</h3>

        {/*filter date  station */}
        <div className="flex gap-2">
          {/* Bộ lọc ngày */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
            }}
            className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none bg-gray-100"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
            }}
            className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none bg-gray-100"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
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
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                color: "black",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`${value} giao dịch`, "Tổng"]}
              labelFormatter={(label) => `Ngày ${label}`}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffTransactionChart;
