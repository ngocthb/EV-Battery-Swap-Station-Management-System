"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { getVerifyEmailCache } from "@/lib/storage";
import { MESSAGES } from "@/constants/messages";

export default function CheckEmailPage() {
  const params = useSearchParams();
  const queryEmail = (params.get("email") ?? "").trim().toLowerCase();

  const cachedEmail = useMemo(() => {
    try {
      const raw = getVerifyEmailCache() as string | { email?: string } | null;
      if (!raw) return "";
      return (typeof raw === "string" ? raw : raw.email ?? "")
        .trim()
        .toLowerCase();
    } catch {
      return "";
    }
  }, []);

  const email = (queryEmail || cachedEmail || "").trim().toLowerCase();

  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(true);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
        cooldownTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) {
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
        cooldownTimer.current = null;
      }
      return;
    }
    if (!cooldownTimer.current) {
      cooldownTimer.current = setInterval(() => {
        setCooldown((v) => (v > 0 ? v - 1 : 0));
      }, 1000);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (loading || cooldown > 0) return;

    if (!email) {
      setMessage("Không tìm thấy email. Vui lòng đăng ký lại.");
      return;
    }

    setMessage(null);
    setLoading(true);
    try {
      await authService.resendVerification(email);
      if (!isMounted.current) return;
      setMessage(MESSAGES?.RESEND_SUCCESS || "Email xác thực đã được gửi lại!");
      setCooldown(60);
    } catch (err: any) {
      if (!isMounted.current) return;

      const status = err?.response?.status as number | undefined;
      const data = err?.response?.data;
      const serverMsg =
        (typeof data === "string" && data) ||
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors)
          ? data.errors.map((e: any) => e?.message ?? e).join(", ")
          : "") ||
        err?.message;

      if (status === 429) {
        setMessage(
          MESSAGES?.TOO_MANY_REQUESTS ||
            serverMsg ||
            "Bạn vừa yêu cầu gần đây. Vui lòng thử lại sau."
        );
        setCooldown(60);
      } else if (status === 400) {
        setMessage(serverMsg || "Email không hợp lệ.");
      } else if (status === 404) {
        setMessage(serverMsg || "Không tìm thấy người dùng với email này.");
      } else {
        setMessage(serverMsg || MESSAGES?.SERVER_ERROR || "Có lỗi máy chủ.");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Kiểm tra email của bạn</h1>

      <p className="sr-only" role="status" aria-live="polite">
        {message ?? ""}
      </p>

      <p className="mb-6">
        Chúng tôi đã gửi liên kết xác thực tới{" "}
        <b>{email || "(Không rõ email)"}</b>. Hãy mở hộp thư (kể cả Spam/Quảng
        cáo) và bấm nút Xác thực.
      </p>

      <button
        onClick={handleResend}
        disabled={cooldown > 0 || loading}
        aria-disabled={cooldown > 0 || loading}
        aria-busy={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading
          ? "Đang gửi…"
          : cooldown > 0
          ? `Gửi lại sau ${cooldown}s`
          : "Gửi lại email xác thực"}
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
