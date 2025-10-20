"use client";

import React from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import CreateMembershipForm from "./components/CreateMembershipForm";

export default function CreateMembershipPage() {
  return (
    <AdminLayout>
      <div className="h-[calc(100vh-140px)]">
        <div className="container ">
          <div className="max-w-6xl mx-auto">
            <CreateMembershipForm />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
