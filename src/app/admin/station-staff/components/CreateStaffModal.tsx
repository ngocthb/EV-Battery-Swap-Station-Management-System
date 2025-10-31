"use client";

import { memo, useState } from "react";
import { X, Shield, Sun, Moon } from "lucide-react";
import { getAllStationList } from "@/services/stationService";
import useFetchList from "@/hooks/useFetchList";
import { QueryParams, Station } from "@/types";
import { createStationStaffAPI } from "@/services/stationStaffService";

interface CreateStaffModalProps {
  openCreateModal: boolean;
  setOpenCreateModal: (value: boolean) => void;
}

interface StaffForm {
  userId: string;
  stationId: number | null;
  isHead: boolean;
  history: {
    shift: "MORNING" | "EVENING";
  };
}

function CreateStaffModal({
  openCreateModal,
  setOpenCreateModal,
}: CreateStaffModalProps) {
  const [form, setForm] = useState<StaffForm>({
    userId: "",
    stationId: null,
    isHead: false,
    history: {
      shift: "MORNING",
    },
  });

  // fetch all station
  const { data: stationList = [] } = useFetchList<Station[], QueryParams>(
    getAllStationList
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "shift") {
      setForm((prev) => ({
        ...prev,
        history: { ...prev.history, shift: value as "MORNING" | "EVENING" },
      }));
    } else if (name === "stationId") {
      setForm((prev) => ({ ...prev, stationId: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createStationStaffAPI(form);
      console.log("create staff res", res);
      setForm({
        userId: "",
        stationId: null,
        isHead: false,
        history: {
          shift: "MORNING",
        },
      });
    } catch (error) {
      console.log("create staff err", error);
    }
  };

  if (!openCreateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Thêm nhân viên mới
          </h2>
          <button
            onClick={() => setOpenCreateModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã người dùng
            </label>
            <input
              type="number"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="Nhập ID người dùng"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Station Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạm làm việc
            </label>
            <select
              name="stationId"
              value={form.stationId ? String(form.stationId) : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Chọn trạm</option>
              {stationList.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ca làm việc
            </label>
            <div className="flex items-center space-x-3">
              <label
                className={`flex items-center px-3 py-2 border rounded-lg cursor-pointer transition ${
                  form.history.shift === "MORNING"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="shift"
                  value="MORNING"
                  checked={form.history.shift === "MORNING"}
                  onChange={handleChange}
                  className="hidden"
                />
                <Sun className="w-4 h-4 mr-2" />
                Sáng
              </label>

              <label
                className={`flex items-center px-3 py-2 border rounded-lg cursor-pointer transition ${
                  form.history.shift === "EVENING"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="shift"
                  value="EVENING"
                  checked={form.history.shift === "EVENING"}
                  onChange={handleChange}
                  className="hidden"
                />
                <Moon className="w-4 h-4 mr-2" />
                Tối
              </label>
            </div>
          </div>

          {/* Is Head */}
          <div className="flex items-center space-x-2">
            <input
              id="isHead"
              type="checkbox"
              checked={form.isHead}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isHead: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isHead"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Shield className="w-4 h-4 mr-1 text-blue-500" />
              Là trưởng trạm
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setOpenCreateModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(CreateStaffModal);
