import { useState } from "react";
import { deleteUserVehicleAPI } from "@/services/userVehicleService";
import { Vehicle } from "@/types";

function DeleteConfirmModal({
  vehicle,
  onSuccess,
  onClose,
}: {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUserVehicleAPI(vehicle?.id || 0);
      onSuccess();
    } catch (error) {
      console.log("delete error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Xác nhận xóa phương tiện
        </h3>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="font-semibold text-gray-800">{vehicle?.name}</p>
          <p className="text-sm text-gray-600">
            {vehicle?.vehicleType?.model || "Không rõ loại"} —{" "}
            <span className="text-gray-500 italic">
              {vehicle?.vehicleType?.description || "Không có mô tả"}
            </span>
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Bạn có chắc chắn muốn
          <span className="font-semibold text-red-600"> xóa </span> phương tiện
          này? <br />
          Hành động này không thể hoàn tác.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
