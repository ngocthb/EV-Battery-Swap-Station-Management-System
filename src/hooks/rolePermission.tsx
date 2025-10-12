"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { RootState } from "@/store";
import authService from "@/services/authService";

interface RolePermissionProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RolePermission: React.FC<RolePermissionProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      // Nếu đang loading, chờ
      if (isLoading) {
        return;
      }

      // Nếu không có user nhưng có token, chờ useAuth fetch profile
      if (!user && authService.getToken()) {
        return;
      }

      // Nếu không có user và không có token, redirect login
      if (!user && !authService.getToken()) {
        router.replace("/login");
        return;
      }

      // Nếu có user nhưng role không hợp lệ
      if (user && !allowedRoles.includes(user.role)) {
        // Redirect based on role
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (user.role === "STAFF") {
          router.replace("/staff/dashboard");
        } else {
          router.replace("/");
        }
        return;
      }

      setIsChecking(false);
    };

    checkPermission();
  }, [user, isLoading, allowedRoles, router]);

  // Show loading while checking
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if no user or no permission
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
