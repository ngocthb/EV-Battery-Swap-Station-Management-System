"use client";

import authService from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState("Đang xác thực...");

  useEffect(() => {
    if (!token) {
      setStatus("Token không hợp lệ.");
      return;
    }

    const handleVerifyEmail = async () => {
      try {
        const res = await authService.verifyEmail(token);
        console.log("Email verified successfully:", res.data);
        setStatus("Xác thực thành công! Chuyển hướng đến đăng nhập...");
        setTimeout(() => router.push("/login"), 1500);
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("Xác thực thất bại. Vui lòng thử lại.");
      }
    };

    handleVerifyEmail();
  }, [token, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1>{status}</h1>
    </div>
  );
}
