"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { CreditCard, Settings } from "lucide-react";

export default function MembershipsPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-pink-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gói Thành viên
          </h3>
          <p className="text-gray-500">
            Chức năng quản lý gói thành viên đang được phát triển
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
