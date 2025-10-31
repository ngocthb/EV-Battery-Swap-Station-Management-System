"use client";

import React, { use } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import UpdateForm from "./components/UpdateForm";
import BatteryTypeDetail from "../../components/BatteryTypeDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditStationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const batteryId = parseInt(resolvedParams.id);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <div className="flex h-full">
          <UpdateForm batteryId={batteryId} />
          <BatteryTypeDetail />
        </div>
      </div>
    </AdminLayout>
  );
}
