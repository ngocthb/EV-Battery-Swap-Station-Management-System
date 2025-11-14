"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sendPaymentCallback } from "@/services/transactionService";
import { toast } from "react-toastify";
import { UserLayout } from "@/layout/UserLayout";

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Extract query parameters
        const code = searchParams.get("code");
        const id = searchParams.get("id");
        const orderCode = searchParams.get("orderCode");
        const status = searchParams.get("status");
        const cancel = searchParams.get("cancel");

        // Validate required parameters
        if (!code || !orderCode || !status) {
          throw new Error("Thiếu thông tin thanh toán. Vui lòng thử lại.");
        }

        // Parse and validate orderCode
        const orderCodeNumber = parseInt(orderCode, 10);
        if (isNaN(orderCodeNumber)) {
          throw new Error("Mã đơn hàng không hợp lệ");
        }

        // Check if payment was cancelled
        if (cancel === "true") {
          setError("Thanh toán đã bị hủy");
          setProcessing(false);
          return;
        }

        // Check if payment was successful
        if (status !== "PAID") {
          throw new Error("Thanh toán không thành công");
        }

        // Send callback to backend
        // Combine code and id in the format the backend expects
        const response = await sendPaymentCallback({
          code: id ? `${code}&id=${id}` : code,
          orderCode: orderCodeNumber,
          status: status,
        });

        if (response.success) {
          setSuccess(true);
          toast.success(response.message || "Thanh toán thành công!");
        } else {
          throw new Error(response.message || "Không thể xác nhận thanh toán");
        }
      } catch (err: any) {
        const errorMessage =
          err.message || "Đã xảy ra lỗi khi xử lý thanh toán";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setProcessing(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams]);

  const handleGoToMemberships = () => {
    router.push("/membership");
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  // Processing state
  if (processing) {
    return (
      <UserLayout>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <svg
                className="h-20 w-20 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <UserLayout>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            {/* Error Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Thanh toán thất bại
            </h2>
            <p className="mb-8 text-gray-600">{error}</p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleGoToMemberships}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Thử lại
              </button>
              <button
                onClick={handleGoToHome}
                className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Success state
  return (
    <UserLayout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          {/* Success Icon with Animation */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Thanh toán thành công!
          </h2>
          <p className="mb-8 text-gray-600">
            Gói thành viên của bạn đã được kích hoạt. Bạn có thể bắt đầu sử dụng
            ngay bây giờ.
          </p>

          {/* Payment Details */}
          <div className="mb-8 rounded-lg bg-gray-50 p-4 text-left">
            <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700">Mã đơn hàng:</span>
              <span className="font-mono text-sm text-gray-900">
                #{searchParams.get("orderCode")}
              </span>
            </div>
            <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700">Trạng thái:</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Đã thanh toán
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Mã giao dịch:</span>
              <span className="font-mono text-xs text-gray-900">
                {searchParams.get("id")}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleGoToHome}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Về trang chủ
            </button>
            <button
              onClick={handleGoToMemberships}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Xem gói thành viên
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="flex items-start">
              <svg
                className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-800">
                Thông tin xác nhận đã được gửi đến email của bạn. Nếu có bất kỳ
                thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PaymentSuccessPage;
