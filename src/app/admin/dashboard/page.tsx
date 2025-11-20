"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import dynamic from "next/dynamic";
import StatList from "./components/StatList";
import StationRate from "./components/StationRate";
import AdminMembershipChart from "./components/chart/AdminMembershipChart";

const AdminStationMap = dynamic(() => import("./components/AdminStationMap"), {
  ssr: false,
});

const AdminTransactionChart = dynamic(
  () => import("./components/chart/AdminTransactionChart"),
  {
    ssr: false,
  }
);
const AdminRevenueChart = dynamic(
  () => import("./components/chart/AdminRevenueChart"),
  {
    ssr: false,
  }
);

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>

        {/* stat */}
        <StatList />

        {/*Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 gap-4 grid grid-cols-1">
          <AdminRevenueChart />
          <div className="grid grid-cols-3 gap-4">
            <AdminTransactionChart />
            <AdminMembershipChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Summary 2/4 bên trái */}
          <StationRate />
        </div>
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <AdminStationMap />
        </div>
      </div>
    </AdminLayout>
  );
}
