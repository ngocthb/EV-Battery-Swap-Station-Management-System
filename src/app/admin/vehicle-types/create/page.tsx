"use client";

import { AdminLayout } from "@/layout/AdminLayout";
import CreateForm from "./components/CreateForm";
import BatteryTypeDetail from "../../batteries/components/BatteryTypeDetail";

export default function CreateStationPage() {
  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] bg-gray-50">
        <div className="flex h-full">
          <CreateForm />
          <BatteryTypeDetail />
        </div>
      </div>
    </AdminLayout>
  );
}
