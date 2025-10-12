"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Battery, Settings } from "lucide-react";

export default function BatteriesPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Battery className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Quản lý Pin
          </h3>
          <p className="text-gray-500">
            Chức năng quản lý pin đang được phát triển
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
