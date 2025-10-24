"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, ArrowLeft, Plus, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import {
  createBatteryTypeAPI,
  getAllBatteryTypeListAPI,
} from "@/services/batteryTypeService";
import { useBatteryAdmin } from "@/app/admin/batteries/context/BatteryAdminContext";
import useFetchList from "@/hooks/useFetchList";
import { BatteryType } from "@/types";
import { createVehicleTypeAPI } from "@/services/vehicleService";

interface FormErrors {
  batteryTypeId?: number;
  model?: string;
  description?: string;
}

const CreateForm = () => {
  const { setBatteryTypeId } = useBatteryAdmin();

  const router = useRouter();
  const [form, setForm] = useState({
    batteryTypeId: 0,
    model: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.model.trim()) {
      newErrors.model = "Tên loại pin không được để trống";
    } else if (form.model.trim().length < 2) {
      newErrors.model = "Tên loại pin phải có ít nhất 2 ký tự";
    }

    if (!form.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    } else if (form.description.trim().length < 2) {
      newErrors.description = "Mô tả phải có ít nhất 2 ký tự";
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
        type === "number" || name === "batteryTypeId" ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const { data: batteryTypeList = [] } = useFetchList<BatteryType[]>(
    getAllBatteryTypeListAPI
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await createVehicleTypeAPI(form);
      if (res.success) {
        toast.success(res.message);
        setForm({ model: "", description: "", batteryTypeId: 0 });
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Tạo loại phương tiện thất bại";
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
            onClick={() => router.push("/admin/vehicle-types")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Tạo loại phương tiện mới
            </h1>
            <p className="text-sm text-gray-600">Nhập thông tin và chọn pin</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* phương tiện Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              <span>Tên loại phương tiện</span>
            </label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="VD: Xe máy 231"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.model ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model}</p>
            )}
          </div>

          {/* phương tiện description */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              <span>Mô tả loại phương tiện</span>
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="VD: China"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/*battery type */}
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
                setBatteryTypeId(Number(e.target.value));
              }}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 w-full"
            >
              <option value={0}>Tìm theo loại pin</option>
              {batteryTypeList.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
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
            onClick={() => router.push("/admin/vehicle-types")}
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
                <span>Tạo loại phương tiện</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
