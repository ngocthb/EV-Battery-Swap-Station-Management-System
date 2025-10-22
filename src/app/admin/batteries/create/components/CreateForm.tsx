"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, ArrowLeft, Plus, Thermometer, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { createCabinetAPI } from "@/services/cabinetService";
import useFetchList from "@/hooks/useFetchList";
import { Station } from "@/types";
import { getAllStationList } from "@/services/stationService";
import { createBatteryAPI } from "@/services/batteryService";
// import { useCabinAdmin } from "../../context/CabinAdminContext";

interface FormErrors {
  model?: string;
  capacity?: number;
  price?: number;
  cycleLife?: number;
}

const CreateForm = () => {
  // const { setStationId } = useCabinAdmin();

  const router = useRouter();
  const [form, setForm] = useState({
    model: "",
    capacity: 0,
    price: 0,
    cycleLife: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: stationList = [] } = useFetchList<Station[]>(getAllStationList);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.model.trim()) {
      newErrors.model = "Tên tủ sạc không được để trống";
    } else if (form.model.trim().length < 2) {
      newErrors.model = "Tên tủ sạc phải có ít nhất 2 ký tự";
    }

    // if (!form.stationId || form.stationId <= 0) {
    //   newErrors.stationId = "Vui lòng chọn trạm";
    // }

    // if (form.temperature.trim() === "") {
    //   newErrors.temperature = "Vui lòng nhập nhiệt độ";
    // } else {
    //   const temp = Number(form.temperature);
    //   if (isNaN(temp)) {
    //     newErrors.temperature = "Nhiệt độ phải là số";
    //   } else if (temp < 0 || temp > 80) {
    //     newErrors.temperature = "Nhiệt độ phải từ 0 đến 80 độ";
    //   }
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" || name === "stationId" ? Number(value) : value,
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
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        cycleLife: Number(form.cycleLife),
      };
      console.log("create battery form", submitData);
      const res = await createBatteryAPI(submitData);
      if (res.success) {
        toast.success(res.message);
        setForm({ model: "", capacity: 0, price: 0, cycleLife: 0 });
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Tạo trạm thất bại";
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
            <h1 className="text-xl font-semibold text-gray-900">Tạo pin mới</h1>
            <p className="text-sm text-gray-600">Nhập thông tin và chọn trạm</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Pin model */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              <span>Mẫu pin sạc</span>
            </label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="VD: pin moi"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.model ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="w-4 h-4" />
              <span>Capacity</span>
            </label>
            <input
              name="capacity"
              type="text"
              min="0"
              max="80"
              value={form.capacity}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.capacity ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
            )}
          </div>

          {/* Cycle life */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="w-4 h-4" />
              <span>Cycle Life</span>
            </label>
            <input
              name="cycleLife"
              type="text"
              min="0"
              max="80"
              value={form.cycleLife}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.cycleLife
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.cycleLife && (
              <p className="mt-1 text-sm text-red-600">{errors.cycleLife}</p>
            )}
          </div>

          {/* Gía trị */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="w-4 h-4" />
              <span>Gía trị</span>
            </label>
            <input
              name="price"
              type="text"
              min="0"
              max="80"
              value={form.price}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.price ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/*Station */}
          {/* <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Station</span>
            </label>
            <select
              name="stationId"
              // value={Number(form.stationId || 0)}
              onChange={(e) => {
                handleChange(e);
                // setStationId(Number(e.target.value));
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
          </div> */}

          {/* Error Message */}
          {/* {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )} */}
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
                <span>Tạo pin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
