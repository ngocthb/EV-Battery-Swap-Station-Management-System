"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Slot } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import {
  closeDeleteModal,
  setDeleteLoading,
} from "@/store/slices/adminModalSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "react-toastify";

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

interface DeleteConfirmModalProps {
  slot: Slot | null;
  onConfirmAPI: (id: number) => Promise<ApiResponse>;
  refreshList: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  slot,
  onConfirmAPI,
  refreshList,
}) => {
  const dispatch = useAppDispatch();
  const { deleteModal } = useSelector((state: RootState) => state.adminModal);

  if (!deleteModal.isOpen || !slot) return null;

  const handleDeleteConfirm = async () => {
    if (!deleteModal.data) return;

    dispatch(setDeleteLoading(true));

    try {
      const response = await onConfirmAPI((deleteModal.data as Slot).id);
      if (response.success) {
        toast.success(response.message);
        refreshList();
        dispatch(closeDeleteModal());
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa ô";
      toast.error(errorMessage);
    } finally {
      dispatch(setDeleteLoading(false));
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
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Xác nhận xóa tủ
            </h3>
          </div>
          <button
            onClick={() => dispatch(closeDeleteModal())}
            disabled={deleteModal.loading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa tủ sạc này? Hành động này không thể hoàn
              tác.
            </p>

            {/* cabin details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Tên tủ:
                </span>
                {/* <p className="text-gray-900">{slot?.name}</p> */}
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">
                  Nhiệt độ:
                </span>
                {/* <p className="text-gray-900">{slot?.temperature}</p> */}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Trạng thái:
                  </span>
                  {/* <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      slot?.status
                    )}`}
                  >
                    {getStatusText(slot?.status)}
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Cảnh báo:</strong> Việc xóa tủ sẽ xóa tất cả dữ liệu liên
              quan và không thể khôi phục.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => dispatch(closeDeleteModal())}
            disabled={deleteModal.loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDeleteConfirm}
            disabled={deleteModal.loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {deleteModal.loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{deleteModal.loading ? "Đang xóa..." : "Xóa tủ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
