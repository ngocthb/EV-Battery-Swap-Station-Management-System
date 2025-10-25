"use client";
import authService from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleVerifyEmail = async (token: string) => {
    try {
      const res = await authService.verifyEmail(token);
      console.log("Email verified successfully:", res.data);
      router.push("/login");
    } catch (error) {
      console.log("Error verifying email:", error);
    }
  };
  useEffect(() => {
    if (token) {
      console.log("Verifying email with token:", token);
      handleVerifyEmail(token);
    }
  }, [token]);

  return (
    <div>
      <h1>Đang xác thực...</h1>
    </div>
  );
}
