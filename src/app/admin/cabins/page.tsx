"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Zap, Settings } from "lucide-react";

export default function CabinsPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Quản lý Cabin sạc
          </h3>
          <p className="text-gray-500">
            Chức năng quản lý cabin sạc đang được phát triển
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
