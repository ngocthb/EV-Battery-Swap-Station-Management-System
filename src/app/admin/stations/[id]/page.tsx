"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import ViewForm from "./components/ViewForm";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewStationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const stationId = parseInt(resolvedParams.id);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <ViewForm stationId={stationId} />
      </div>
    </AdminLayout>
  );
}
