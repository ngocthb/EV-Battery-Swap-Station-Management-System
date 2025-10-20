import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import UpdateForm from "./components/UpdateForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStationPage({ params }: PageProps) {
  const resolvedParams = await params;
  const cabinId = parseInt(resolvedParams.id);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <div className="flex h-full">
          <UpdateForm cabinId={cabinId} />
          <div>alo alo</div>
        </div>
      </div>
    </AdminLayout>
  );
}
