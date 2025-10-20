"use client";

import React from "react";
import { Trash2, X } from "lucide-react";
import { Membership } from "@/types";

interface DeleteMembershipModalProps {
  isOpen: boolean;
  membership: Membership | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteMembershipModal: React.FC<DeleteMembershipModalProps> = ({
  isOpen,
  membership,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !membership) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration < 30) {
      return `${duration} ngày`;
    } else if (duration < 365) {
      const months = Math.floor(duration / 30);
      return `${months} tháng`;
    } else {
      const years = Math.floor(duration / 365);
      return `${years} năm`;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Xác nhận xóa gói
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn xóa gói thành viên này? Hành động này không
            thể hoàn tác.
          </p>

          {/* Membership details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Tên gói:
              </span>
              <p className="text-gray-900">{membership.name}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700">Mô tả:</span>
              <p className="text-gray-900 text-sm">{membership.description}</p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-700">Giá:</span>
                <span className="ml-2 text-gray-900">
                  {formatPrice(membership.price || 0)}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">
                  Thời hạn:
                </span>
                <span className="ml-2 text-gray-900">
                  {formatDuration(membership.duration || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-800">
              <strong>Cảnh báo:</strong> Việc xóa gói sẽ ảnh hưởng đến tất cả
              người dùng đang sử dụng gói này.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{loading ? "Đang xóa..." : "Xóa gói"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMembershipModal;
