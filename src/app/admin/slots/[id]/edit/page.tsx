"use client";

import React, { use } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import UpdateForm from "./components/UpdateForm";
import StationDetailInCabin from "./components/CabinAndBatteryDetail";
import CabinAndBatteryDetail from "./components/CabinAndBatteryDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditStationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slotId = parseInt(resolvedParams.id);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <div className="flex h-full">
          <UpdateForm slotId={slotId} />
          <CabinAndBatteryDetail />
        </div>
      </div>
    </AdminLayout>
  );
}
