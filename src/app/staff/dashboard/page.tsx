"use client";

import RevenueChart from "@/components/Charts/BarChart";
import UserGrowthChart from "@/components/Charts/LineChart";
import UserDistributionChart from "@/components/Charts/PieChart";
import { StaffLayout } from "@/layout/StaffLayout";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function StaffDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <StaffLayout>
      <div className="min-h-screen space-y-4">
        {/*Overall */}
        <div className="w-full bg-white/90 rounded-3xl p-10 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
                Staff Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Welcome Manage your station operations here.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                Start Shift
              </button>
              <button className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">
                End Shift
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
              <span className="text-2xl font-bold text-blue-700 mb-2">24</span>
              <span className="text-gray-600">Batteries Available</span>
            </div>
            <div className="bg-blue-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
              <span className="text-2xl font-bold text-blue-700 mb-2">12</span>
              <span className="text-gray-600">Today's Swaps</span>
            </div>
            <div className="bg-blue-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow">
              <span className="text-2xl font-bold text-blue-700 mb-2">98%</span>
              <span className="text-gray-600">Station Health</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow mt-4">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Battery Swap
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Check Inventory
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Report Issue
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Maintenance Log
              </button>
            </div>
          </div>
        </div>

        {/*Chart */}
        <div>
          <UserGrowthChart
            heading={"Biểu đồ tăng trưởng người dùng"}
            subHeading={"Hàng tháng"}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <RevenueChart heading={"Doanh thu"} subHeading={"Hàng ngày"} />
          <UserDistributionChart
            heading={"Phân bố người dùng"}
            subHeading={"Hàng tháng"}
          />
        </div>
      </div>
    </StaffLayout>
  );
}
