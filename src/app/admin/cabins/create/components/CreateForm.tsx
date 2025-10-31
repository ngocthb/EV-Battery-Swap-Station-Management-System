"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, ArrowLeft, Plus, Thermometer, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { createCabinetAPI } from "@/services/cabinetService";
import useFetchList from "@/hooks/useFetchList";
import { BatteryType, Station } from "@/types";
import { getAllStationList } from "@/services/stationService";
import { getAllBatteryTypeListAPI } from "@/services/batteryTypeService";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  fetchStationDetail,
  setStationId,
} from "@/store/slices/adminDetailStateSlice";

interface FormErrors {
  name?: string;
  stationId?: string;
  batteryTypeId?: string;
  slotCount?: string;
}

const CreateForm = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    stationId: 0,
    batteryTypeId: 0,
    slotCount: 12,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: stationList = [] } = useFetchList<Station[]>(getAllStationList);
  const { data: batteryTypeList = [] } = useFetchList<BatteryType[]>(
    getAllBatteryTypeListAPI
  );

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên tủ sạc không được để trống";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Tên tủ sạc phải có ít nhất 2 ký tự";
    }

    if (!form.stationId || form.stationId <= 0) {
      newErrors.stationId = "Vui lòng chọn trạm";
    }

    if (!form.batteryTypeId || form.batteryTypeId <= 0) {
      newErrors.batteryTypeId = "Vui lòng chọn pin";
    }

    if (!form.slotCount || Number(form.slotCount) <= 0) {
      newErrors.slotCount = "Số slot phải lớn hơn 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "stationId" || name === "slotCount" || name === "batteryTypeId"
          ? Number(value)
          : type === "number"
          ? Number(value)
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form", form);
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: form.name,
        stationId: Number(form.stationId),
        batteryTypeId: Number(form.batteryTypeId),
        slotCount: Number(form.slotCount),
      };
      const res = await createCabinetAPI(submitData);
      if (res.success) {
        toast.success(res.message);
        setForm({ name: "", stationId: 0, batteryTypeId: 0, slotCount: 0 });
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Tạo tủ thất bại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/admin/cabins")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Tạo tủ sạc mới
            </h1>
            <p className="text-sm text-gray-600">Nhập thông tin và chọn trạm</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Cabin Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              <span>Tên tủ sạc</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="VD: Tủ 3"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/*battery */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Loại pin</span>
            </label>
            <select
              name="batteryTypeId"
              value={Number(form.batteryTypeId || 0)}
              onChange={(e) => {
                handleChange(e);
              }}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 w-full"
            >
              <option value={0}>Chọn theo loại pin</option>
              {batteryTypeList.map((battery) => (
                <option key={battery.id} value={battery.id}>
                  {battery.name}
                </option>
              ))}
            </select>
          </div>

          {/* Slot count */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <span>Số ô pin</span>
            </label>
            <input
              name="slotCount"
              type="number"
              min={1}
              max={12}
              value={form.slotCount}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.slotCount
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              readOnly
            />
            {errors.slotCount && (
              <p className="mt-1 text-sm text-red-600">{errors.slotCount}</p>
            )}
          </div>

          {/*Station */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Station</span>
            </label>
            <select
              name="stationId"
              value={Number(form.stationId || 0)}
              onChange={(e) => {
                handleChange(e);
                const id = Number(e.target.value);
                dispatch(setStationId(id));
                dispatch(fetchStationDetail(id));
              }}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 w-full"
            >
              <option value={0}>Tìm theo tên trạm</option>
              {stationList.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </form>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/admin/stations")}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Tạo tủ sạc</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
