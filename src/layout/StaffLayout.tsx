"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Users,
  BarChart3,
  Bell,
  Search,
  Battery,
  MessageCircleMore,
  BarChart2,
} from "lucide-react";
import { RolePermission } from "@/hooks/rolePermission";
import Image from "next/image";
interface StaffLayoutProps {
  children: React.ReactNode;
}
export const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    {
      id: "dashboard",
      label: "Tổng quan",
      href: "/staff/dashboard",
      icon: BarChart3,
    },
    {
      id: "users",
      label: "Người dùng",
      href: "/staff/users",
      icon: Users,
    },
    {
      id: "slotAndBattery",
      label: "Ô sạc và pin",
      href: "/staff/slot-battery",
      icon: Battery,
    },

    {
      id: "transaction",
      label: "Giao dịch của trạm",
      href: "/staff/transaction",
      icon: BarChart2,
    },
    {
      id: "chat",
      label: "Tin nhắn người dùng",
      href: "/staff/chat",
      icon: MessageCircleMore,
    },
    {
      id: "reports",
      label: "Báo cáo",
      href: "/staff/reports",
      icon: Search,
    },
  ];

  return (
    <RolePermission allowedRoles={["STAFF", "ADMIN"]}>
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
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-600">Staff</p>
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
                          ? "bg-green-50 text-green-700 border border-green-200"
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
