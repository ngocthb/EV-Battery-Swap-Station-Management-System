"use client";

import React from "react";
import { RolePermission } from "@/hooks/rolePermission";
import { Header } from "@/components/Header";

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <RolePermission allowedRoles={["STAFF", "ADMIN", "USER"]}>
      <div className="h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </RolePermission>
  );
};
