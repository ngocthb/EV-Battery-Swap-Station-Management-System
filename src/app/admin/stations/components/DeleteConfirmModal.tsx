"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Station } from "@/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  station: Station | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  station,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !station) return null;

  const getStatusText = (status: boolean) => {
    return status ? "Hoạt động" : "Đóng cửa";
  };

  const getStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Xác nhận xóa trạm
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
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa trạm sạc này? Hành động này không thể
              hoàn tác.
            </p>

            {/* Station details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Tên trạm:
                </span>
                <p className="text-gray-900">{station.name}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">
                  Địa chỉ:
                </span>
                <p className="text-gray-900 text-sm">{station.address}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Số pin:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {station.batteryCount || 0}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Trạng thái:
                  </span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      station.status
                    )}`}
                  >
                    {getStatusText(station.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Cảnh báo:</strong> Việc xóa trạm sẽ xóa tất cả dữ liệu
              liên quan và không thể khôi phục.
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
            <span>{loading ? "Đang xóa..." : "Xóa trạm"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
