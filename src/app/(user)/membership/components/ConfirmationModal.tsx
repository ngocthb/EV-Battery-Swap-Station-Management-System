"use client";

import React from "react";
import { Membership } from "@/types/index";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  membership: Membership | null;
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  membership,
  isLoading,
}) => {
  if (!isOpen || !membership) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="h-6 w-6"
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
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Xác nhận đăng ký
          </h3>
          <p className="mb-6 text-gray-600">
            Bạn có chắc chắn muốn đăng ký gói thành viên sau không?
          </p>

          {/* Membership Details */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-gray-700">Tên gói:</span>
              <span className="text-gray-900">{membership.name}</span>
            </div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-gray-700">Giá:</span>
              <span className="text-lg font-bold text-blue-600">
                {(membership.price ?? 0).toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">
                Phương thức thanh toán:
              </span>
              <span className="text-gray-900">Ví điện tử</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
