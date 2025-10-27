import useFetchList from "@/hooks/useFetchList";
import {
  createUserVehicleAPI,
  updateUserVehicleAPI,
} from "@/services/userVehicleService";
import { getAllVehicleTypeListForUserAPI } from "@/services/vehicleService";
import { Vehicle, VehicleType } from "@/types";
import { useEffect, useMemo, useState } from "react";

interface AddVehicleModalProps {
  onClose: () => void;
  onSuccess: () => void;
  showModal: string | null;
  editData?: Vehicle | null;
}

function AddVehicleModal({
  onClose,
  onSuccess,
  showModal,
  editData,
}: AddVehicleModalProps) {
  const [name, setName] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: vehicleTypeList = [] } = useFetchList<VehicleType[]>(
    getAllVehicleTypeListForUserAPI
  );

  useEffect(() => {
    if (showModal === "update" && editData) {
      setName(editData.name || "");
      setVehicleTypeId(editData.vehicleType?.id || 0);
    } else {
      setName("");
      setVehicleTypeId(0);
    }
  }, [showModal, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !vehicleTypeId) return alert("Vui lòng nhập đủ thông tin!");

    try {
      setLoading(true);
      if (showModal === "update" && editData) {
        await updateUserVehicleAPI(Number(editData?.id), {
          name,
          vehicleTypeId,
        });
      } else {
        await createUserVehicleAPI({ name, vehicleTypeId });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Thêm phương tiện thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = useMemo(
    () => vehicleTypeList.find((t) => t.id === Number(vehicleTypeId)),
    [vehicleTypeId, vehicleTypeList]
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thêm phương tiện mới
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tên phương tiện
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ví dụ: Vinfast Evo 200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Loại phương tiện
            </label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={vehicleTypeId}
              onChange={(e) => setVehicleTypeId(Number(e.target.value))}
            >
              <option value={0}>-- Chọn loại phương tiện --</option>
              {vehicleTypeList.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.model}
                </option>
              ))}
            </select>
          </div>

          {selectedType && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm space-y-1">
              <p>
                <span className="font-medium text-gray-700">Loại pin: </span>
                <span className="text-gray-800">
                  {selectedType.batteryTypeName}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Mô tả: </span>
                <span className="text-gray-600">
                  {selectedType.description}
                </span>
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicleModal;
