import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import ViewForm from "./view/ViewForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewStationPage({ params }: PageProps) {
  const resolvedParams = await params;
  const batteryId = parseInt(resolvedParams.id);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <ViewForm batteryId={batteryId} />
      </div>
    </AdminLayout>
  );
}
