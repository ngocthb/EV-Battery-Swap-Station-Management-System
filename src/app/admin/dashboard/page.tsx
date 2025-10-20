"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/layout/AdminLayout";
import { MapPin, Users, CreditCard, TrendingUp } from "lucide-react";

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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/stations"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block text-center"
            >
              <MapPin className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-900">Quản lý trạm</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block text-center"
            >
              <Users className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-900">Quản lý user</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
