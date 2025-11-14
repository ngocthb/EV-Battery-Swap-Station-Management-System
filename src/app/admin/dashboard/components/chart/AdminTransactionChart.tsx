import { getDashboardTransactionChartAPI } from "@/services/dashboardService";
import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

const AdminTransactionChart = () => {
  const socketRef = useRef<Socket | null>(null);
  const [chartData, setChartData] = useState<{ date: string; total: number }[]>(
    []
  );
  const [fromDate, setFromDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Tính toán ngày to = from + 7 ngày
  const getToDate = (from: string) => {
    const date = new Date(from);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  };

  const fetchTransactionChartAPI = async (from: string) => {
    if (!from) return;

    try {
      setLoading(true);
      const to = getToDate(from);

      const res = await getDashboardTransactionChartAPI({ from, to });
      const data = res?.data || [];

      const formatted = data.map((item: any) => ({
        date: item.date,
        total: item.total,
      }));

      setChartData(formatted);
    } catch (error) {
      console.error("❌ [Chart] Error fetching transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    setFromDate(todayStr);
    fetchTransactionChartAPI(todayStr);
  }, []);

  // Socket connection for real-time updates
  useEffect(() => {
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL || "https://amply.io.vn/api/v1/";
    const socketURL = baseURL.replace("/api/v1/", "");

    const socket = io(`${socketURL}/transaction`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ [Chart] Connected to /transaction namespace:", socket.id);
    });

    socket.on(
      "payment_confirmed",
      (data: {
        transactionId: number;
        bookingId?: number;
        userMembershipId?: number;
        status: string;
        totalPrice: number;
      }) => {
        console.log("🔔 [Chart] Payment confirmed:", data);
        toast.success(
          `Giao dịch mới: ${
            data.bookingId
              ? `Booking #${data.bookingId}`
              : `Membership #${data.userMembershipId}`
          } - ${data.totalPrice.toLocaleString("vi-VN")} VND`,
          { autoClose: 3000 }
        );

        // Refresh chart data to include new transaction
        if (fromDate) {
          fetchTransactionChartAPI(fromDate);
        }
      }
    );

    socket.on(
      "payment_failed",
      (data: { transactionId: number; reason: string }) => {
        console.log("❌ [Chart] Payment failed:", data);
        toast.error(`Thanh toán thất bại: Transaction #${data.transactionId}`, {
          autoClose: 3000,
        });

        // Refresh chart data
        if (fromDate) {
          fetchTransactionChartAPI(fromDate);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("🔌 [Chart] Disconnected from /transaction namespace");
    });

    return () => {
      socket.disconnect();
    };
  }, [fromDate]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 transition-colors duration-300 hover:border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Giao dịch trong 7 ngày
        </h3>

        {/* Bộ lọc ngày */}
        <div>
          <label className="mr-2 text-gray-400">Từ</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              fetchTransactionChartAPI(e.target.value);
            }}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700"
          />
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
            <div className="text-gray-400">Không có dữ liệu giao dịch</div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AdminTransactionChart;
