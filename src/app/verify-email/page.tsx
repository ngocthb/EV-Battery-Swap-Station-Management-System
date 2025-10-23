"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { HttpError } from "@/services/http";

type Status =
  | "idle"
  | "verifying"
  | "success"
  | "expired"
  | "invalid"
  | "error";
type Action =
  | { type: "SET_STATUS"; status: Status; message?: string }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "TICK" }
  | { type: "SET_COOLDOWN"; value: number }
  | { type: "SENDING"; value: boolean };

interface State {
  status: Status;
  message: string;
  cooldown: number;
  sending: boolean;
}

const initialState: State = {
  status: "idle",
  message: "",
  cooldown: 0,
  sending: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STATUS":
      return {
        ...state,
        status: action.status,
        message: action.message ?? state.message,
      };
    case "SET_MESSAGE":
      return { ...state, message: action.message };
    case "TICK":
      return { ...state, cooldown: Math.max(0, state.cooldown - 1) };
    case "SET_COOLDOWN":
      return { ...state, cooldown: Math.max(0, action.value) };
    case "SENDING":
      return { ...state, sending: action.value };
    default:
      return state;
  }
}

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const queryEmail = (params.get("email") ?? "").trim().toLowerCase();

  const [state, dispatch] = useReducer(reducer, initialState);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fallbackEmail = useMemo(() => {
    if (queryEmail) return queryEmail;
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("verifyEmail");
      const parsed = raw ? JSON.parse(raw) : null;
      return (parsed?.email ?? "").trim().toLowerCase();
    } catch {
      return "";
    }
  }, [queryEmail]);

  useEffect(() => {
    if (state.cooldown <= 0 || cooldownTimer.current) return;
    cooldownTimer.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => {
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
        cooldownTimer.current = null;
      }
    };
  }, [state.cooldown]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!token) {
        dispatch({
          type: "SET_STATUS",
          status: "invalid",
          message: "Thiếu token. Vui lòng yêu cầu gửi lại email xác thực.",
        });
        return;
      }
      dispatch({ type: "SET_STATUS", status: "verifying", message: "" });

      try {
        const resMsg = await authService.verifyEmail(token);
        if (cancelled) return;
        dispatch({
          type: "SET_STATUS",
          status: "success",
          message: resMsg || "Xác thực email thành công! Bạn có thể đăng nhập.",
        });
        redirectTimer.current = setTimeout(() => router.push("/login"), 2500);
      } catch (e) {
        if (cancelled) return;
        const he = e as HttpError;
        if (he.status === 410) {
          dispatch({
            type: "SET_STATUS",
            status: "expired",
            message:
              he.message ||
              "Liên kết xác thực đã hết hạn hoặc đã được sử dụng.",
          });
        } else if (he.status === 400) {
          dispatch({
            type: "SET_STATUS",
            status: "invalid",
            message:
              he.message ||
              "Token không hợp lệ. Vui lòng yêu cầu gửi lại email.",
          });
        } else {
          dispatch({
            type: "SET_STATUS",
            status: "error",
            message: he.message || "Có lỗi xảy ra khi xác thực email.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
        redirectTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleResend = async () => {
    if (state.sending || state.cooldown > 0) return;
    dispatch({ type: "SENDING", value: true });
    dispatch({ type: "SET_MESSAGE", message: "" });

    try {
      const email = fallbackEmail;
      if (!email) {
        dispatch({
          type: "SET_MESSAGE",
          message:
            "Không tìm thấy email đã đăng ký. Hãy đăng ký lại hoặc mở trang Kiểm tra email.",
        });
        return;
      }
      const resMsg = await authService.resendVerification(email);
      dispatch({
        type: "SET_MESSAGE",
        message:
          resMsg || "Nếu email hợp lệ, chúng tôi đã gửi liên kết xác thực mới.",
      });
      dispatch({ type: "SET_COOLDOWN", value: 60 }); // throttle 60s
    } catch (e) {
      const he = e as HttpError;
      if (he.status === 429) {
        dispatch({
          type: "SET_MESSAGE",
          message:
            he.message ||
            "Bạn vừa yêu cầu gần đây. Vui lòng thử lại sau ít phút.",
        });
        dispatch({ type: "SET_COOLDOWN", value: 60 });
      } else if (he.status === 400) {
        dispatch({
          type: "SET_MESSAGE",
          message: he.message || "Email không hợp lệ.",
        });
      } else if (he.status === 404) {
        dispatch({
          type: "SET_MESSAGE",
          message: he.message || "Không tìm thấy người dùng với email này.",
        });
      } else {
        dispatch({
          type: "SET_MESSAGE",
          message: he.message || "Không thể gửi lại email xác thực.",
        });
      }
    } finally {
      dispatch({ type: "SENDING", value: false });
    }
  };

  return (
    <main className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Xác thực email</h1>

      {/* Live region cho screen reader */}
      <p className="sr-only" role="status" aria-live="polite">
        {state.message}
      </p>

      {state.status === "verifying" && <p>Đang xác thực liên kết của bạn…</p>}

      {state.status === "success" && (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-green-700">
          {state.message}
          <p className="mt-2 text-sm text-green-700/80">
            Đang chuyển đến trang đăng nhập…
          </p>
        </div>
      )}

      {state.status === "expired" && (
        <div className="space-y-4">
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-800">
            {state.message}
          </div>
          <button
            onClick={handleResend}
            disabled={state.cooldown > 0 || state.sending}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
            aria-disabled={state.cooldown > 0 || state.sending}
            aria-busy={state.sending}
          >
            {state.sending
              ? "Đang gửi…"
              : state.cooldown > 0
              ? `Gửi lại sau ${state.cooldown}s`
              : "Gửi lại email xác thực"}
          </button>
        </div>
      )}

      {state.status === "invalid" && (
        <div className="space-y-4">
          <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {state.message}
          </div>
          <button
            onClick={() => router.push("/check-email")}
            className="border px-4 py-2 rounded"
          >
            Về trang Kiểm tra email
          </button>
        </div>
      )}

      {state.status === "error" && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {state.message}
        </div>
      )}
    </main>
  );
}
