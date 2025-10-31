"use client";

import React from "react";
import { RotateCcw, X } from "lucide-react";
import { BatteryType } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  closeRestoreModal,
  setRestoreLoading,
} from "@/store/slices/adminModalSlice";
import { toast } from "react-toastify";

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

interface RestoreConfirmModalProps {
  batteryType: BatteryType | null;
  onConfirmAPI: (id: number) => Promise<ApiResponse>;
  refreshList: () => void;
}

const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({
  batteryType,
  onConfirmAPI,
  refreshList,
}) => {
  const dispatch = useAppDispatch();
  const { restoreModal } = useSelector((state: RootState) => state.adminModal);

  if (!restoreModal.isOpen || !batteryType) return null;

  const handleRestoreConfirm = async () => {
    if (!restoreModal.data) return;

    // setRestoreModal((prev) => ({ ...prev, loading: true }));
    dispatch(setRestoreLoading(true));

    try {
      const response = await onConfirmAPI(
        (restoreModal.data as BatteryType).id
      );
      if (response.success) {
        toast.success(response.message || "Khôi phục tủ thành công!");
        refreshList();
        dispatch(closeRestoreModal());
      } else {
        toast.error(response.message || "Khôi phục tủ thất bại!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi khôi phục tủ";
      toast.error(errorMessage);
    } finally {
      dispatch(setRestoreLoading(false));
    }
  };

  const getStatusText = (status: boolean) => {
    return status ? "Hoạt động" : "Đóng cửa";
  };

  const getStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <RotateCcw className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Xác nhận khôi phục loại pin
            </h3>
          </div>
          <button
            onClick={() => dispatch(closeRestoreModal())}
            disabled={restoreModal.loading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn khôi phục loại pin này? Loại này sẽ được
              kích hoạt trở lại và có thể phục vụ khách hàng.
            </p>

            {/* battery type details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Tên tủ:
                </span>
                <p className="text-gray-900">{batteryType?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Mô tả:
                </span>
                <p className="text-gray-900">{batteryType?.description}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">
                  Capacity
                </span>
                <p className="text-gray-900">{batteryType?.capacityKWh} KWh</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">
                  Gía mỗi lần đổi
                </span>
                <p className="text-gray-900">{batteryType?.pricePerSwap} KWh</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Trạng thái:
                  </span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      !!batteryType?.status
                    )}`}
                  >
                    {getStatusText(!!batteryType?.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Lưu ý:</strong> Sau khi khôi phục, loại này sẽ chuyển sang
              trạng thái "Hoạt động" và có thể được sử dụng bởi khách hàng.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => dispatch(closeRestoreModal())}
            disabled={restoreModal.loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleRestoreConfirm}
            disabled={restoreModal.loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {restoreModal.loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>
              {restoreModal.loading
                ? "Đang khôi phục..."
                : "Khôi phục loại này"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreConfirmModal;
