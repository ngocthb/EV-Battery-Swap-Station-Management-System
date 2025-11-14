"use client";

import { memo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Station } from "@/types";
import { transferStaffAPI } from "@/services/stationStaffService";
import useFetchList from "@/hooks/useFetchList";
import { getAllStationList } from "@/services/stationService";

interface MoveStaffStationModalProps {
  staffId: number;
  setStaffMoveStationId: (value: number | null) => void;
  refresh: () => void;
}

function MoveStaffStationModal({
  staffId,
  setStaffMoveStationId,
  refresh,
}: MoveStaffStationModalProps) {
  const [newStationId, setNewStationId] = useState<number | null>(null);
  const [moveDate, setMoveDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stationError, setStationError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const { data: stationList = [] } = useFetchList<Station[]>(getAllStationList);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStationError(null);
    setDateError(null);

    if (!newStationId) {
      setStationError("Vui lòng chọn trạm!");
      toast.error("Vui lòng chọn trạm!");
      return;
    }

    if (!moveDate) {
      setDateError("Vui lòng chọn ngày chuyển!");
      toast.error("Vui lòng chọn ngày chuyển!");
      return;
    }

    // check date
    const selected = new Date(`${moveDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected <= today) {
      setDateError("Hãy chọn ngày tiếp theo");
      toast.error("Hãy chọn ngày tiếp theo");
      return;
    }

    const payload = {
      userId: Number(staffId),
      newStationId,
      date: moveDate,
    };

    try {
      setLoading(true);
      console.log("payload", payload);
      const res = await transferStaffAPI(payload);
      console.log("move staff res", res.data);
      toast.success("Chuyển trạm thành công!");
      refresh();
      setStaffMoveStationId(null);
    } catch (error) {
      console.error(error);
      toast.error("Chuyển trạm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!staffId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chuyển trạm nhân viên</h2>
          <button onClick={() => setStaffMoveStationId(null)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select station */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn trạm mới
            </label>
            <select
              className="border rounded-lg w-full p-2"
              value={newStationId ?? ""}
              onChange={(e) => setNewStationId(Number(e.target.value))}
            >
              <option value="">-- Chọn trạm --</option>
              {stationList.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            {stationError && (
              <p className="text-xs text-red-600 mt-1">{stationError}</p>
            )}
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn ngày chuyển
            </label>
            <input
              type="date"
              className="border rounded-lg w-full p-2"
              value={moveDate ?? ""}
              onChange={(e) => {
                setMoveDate(e.target.value);
                setDateError(null);
              }}
            />
            {dateError && (
              <p className="text-xs text-red-600 mt-1">{dateError}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? "Đang xử lý..." : "Xác nhận chuyển trạm"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default memo(MoveStaffStationModal);
