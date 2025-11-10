"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { MapPin, Users, CreditCard, TrendingUp } from "lucide-react";

import dynamic from "next/dynamic";

const AdminStationMap = dynamic(() => import("./components/AdminStationMap"), {
  ssr: false,
});

const AdminBookingChart = dynamic(
  () => import("./components/chart/AdminBookingChart"),
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
interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center text-sm text-green-600">
        <TrendingUp className="w-4 h-4 mr-1" />
        {change}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">
      {value.toLocaleString()}
    </h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>

        {/* stat */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Tổng số trạm"
            value={45}
            change="+12%"
            icon={MapPin}
            color="bg-blue-500"
          />
          <StatCard
            title="Người dùng"
            value={2847}
            change="+25%"
            icon={Users}
            color="bg-purple-500"
          />
          <StatCard
            title="Thành viên hoạt động"
            value={1205}
            change="+18%"
            icon={CreditCard}
            color="bg-pink-500"
          />
        </div>

        {/*Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdminBookingChart title="Tổng đơn" initialFilter="7d" />
          <AdminRevenueChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Summary 1/3 bên trái */}
          <div className="space-y-4 col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold mb-2">Trạm được đặt nhiều nhất</h3>
              {/* Station info */}
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold mb-2">Trạm đánh giá cao nhất</h3>
              {/* Station info */}
            </div>
          </div>

          {/* Map 2/3 bên phải */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <AdminStationMap />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
