"use client";

import React, { use } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import UpdateMembershipForm from "./components/UpdateMembershipForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditMembershipPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-140px)]">
        <div className="max-w-6xl mx-auto">
          <UpdateMembershipForm membershipId={parseInt(resolvedParams.id)} />
        </div>
      </div>
    </AdminLayout>
  );
}
