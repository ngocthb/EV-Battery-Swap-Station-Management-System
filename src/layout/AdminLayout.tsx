"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  MapPin,
  Zap,
  Battery,
  Users,
  CreditCard,
  BarChart3,
  Bell,
  BatteryPlus,
  Bike,
  Box,
  Calendar,
  BarChart2,
  Notebook,
  Search,
  UserStar,
} from "lucide-react";
import { RolePermission } from "@/hooks/rolePermission";
import Image from "next/image";
interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    {
      id: "dashboard",
      label: "Tổng quan",
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      id: "users",
      label: "Người dùng",
      href: "/admin/users",
      icon: Users,
    },
    {
      id: "station-staff",
      label: "Nhân viên",
      href: "/admin/station-staff",
      icon: UserStar,
    },

    {
      id: "transaction",
      label: "Giao dịch",
      href: "/admin/transactions",
      icon: BarChart2,
    },
    {
      id: "stations",
      label: "Trạm",
      href: "/admin/stations",
      icon: MapPin,
    },

    { id: "cabins", label: "Tủ pin", href: "/admin/cabins", icon: Zap },
    { id: "slots", label: "Ô Sạc", href: "/admin/slots", icon: Box },

    {
      id: "batteries",
      label: "Pin",
      href: "/admin/batteries",
      icon: Battery,
    },

    {
      id: "booking",
      label: "Đặt lịch",
      href: "/admin/booking",
      icon: Calendar,
    },

    {
      id: "report",
      label: "Báo cáo",
      href: "/admin/reports",
      icon: Search,
    },
    {
      id: "feedbacks",
      label: "Đánh giá của trạm",
      href: "/admin/feedbacks",
      icon: Notebook,
    },
    {
      id: "battery-types",
      label: "Loại Pin",
      href: "/admin/battery-types",
      icon: BatteryPlus,
    },
    {
      id: "vehicle",
      label: "Loại phương tiện",
      href: "/admin/vehicle-types",
      icon: Bike,
    },
    {
      id: "memberships",
      label: "Gói Thành viên",
      href: "/admin/memberships",
      icon: CreditCard,
    },
  ];

  return (
    <RolePermission allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center mr-8">
                  <div className="w-10 h-10 relative">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">amply</h1>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-600">Admin</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
            <nav className="p-4">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </RolePermission>
  );
};
