"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  MapPin,
  Building,
  ArrowLeft,
  Save,
  Loader2,
  Thermometer,
} from "lucide-react";
import { toast } from "react-toastify";
import useFetchList from "@/hooks/useFetchList";
import { Battery, BatteryType, Cabinet } from "@/types";
import { getAllBatteryTypeListAPI } from "@/services/batteryTypeService";
import { getBatteryById, updateBatteryAPI } from "@/services/batteryService";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchBatteryTypeDetail,
  setBatteryTypeId,
} from "@/store/slices/adminDetailStateSlice";
import { getCabinetByIdAPI } from "@/services/cabinetService";
import { getSlotStatusText } from "@/utils/formateStatus";

interface FormErrors {
  batteryTypeId?: number;
  model?: string;
  status?: string;
}

interface UpdateFormProps {
  batteryId: number;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ batteryId }) => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [form, setForm] = useState({
    batteryTypeId: 0,
    model: "",
    status: "AVAILABLE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [batteryDetail, setBatteryDetail] = useState<Battery | null>(null);
  const [cabinDetail, setCabinDetail] = useState<Cabinet | null>(null);

  const { data: batteryTypeList = [] } = useFetchList<BatteryType[]>(
    getAllBatteryTypeListAPI
  );

  const fetchBatteryDetailById = async () => {
    setLoading(true);
    try {
      const res = await getBatteryById(batteryId);
      setBatteryDetail(res.data);
      setForm({
        batteryTypeId: res?.data?.batteryType?.id,
        model: res?.data?.model,
        status: res?.data?.status,
      });

      if (res?.data?.slot) {
        const cabinRes = await getCabinetByIdAPI(res?.data?.slot?.cabinetId);
        setCabinDetail(cabinRes?.data);
      }

      // redux lay battery type show ben right side
      const id = res.data?.batteryType?.id;
      dispatch(setBatteryTypeId(id));
      dispatch(fetchBatteryTypeDetail(id));
    } catch (error: unknown) {
      console.error("loi fetch cabin detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteryDetailById();
  }, [batteryId, router]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.model.trim()) {
      newErrors.model = "Mẫu pin không được để trống";
    } else if (form.model.trim().length < 2) {
      newErrors.model = "Mẫu pin phải có ít nhất 2 ký tự";
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
      [name]: type === "number" || name === "batteryId" ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log("update pin form", form);
      const response = await updateBatteryAPI(batteryId, form);

      if (response.success) {
        toast.success(response.message);
      } else {
        setError(response.message);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Cập nhật pin thất bại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-1/2 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin pin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/admin/batteries")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Cập nhật pin
            </h1>
            <p className="text-sm text-gray-600">
              Cập nhật thông tin pin trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/*thông tin ô sạc chứa pin */}
      {batteryDetail?.slot ? (
        <div className="p-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Thông tin ô sạc chứa pin
          </h2>

          <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Tên ô sạc</p>
              <p className="text-base font-medium text-gray-800">
                {batteryDetail?.slot?.name || "Không có dữ liệu"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Tủ sạc</p>
              <p className="text-base font-medium text-gray-800">
                {cabinDetail?.name ||
                  `Cabinet #${batteryDetail?.slot?.cabinetId}`}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Loại pin phù hợp</p>
              <p className="text-base font-medium text-gray-800">
                {cabinDetail?.batteryTypeId
                  ? `Loại pin ${cabinDetail?.batteryTypeId}`
                  : "Không có dữ liệu"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Trạng thái ô sạc</p>
              <p className="text-base font-medium text-gray-800">
                {getSlotStatusText(batteryDetail?.slot?.status) ||
                  "Không có dữ liệu"}
              </p>
            </div>
          </div>

          {/* Cảnh báo nếu chọn sai loại pin */}
          {form.batteryTypeId !== 0 &&
            cabinDetail?.batteryTypeId &&
            Number(form.batteryTypeId) !== cabinDetail?.batteryTypeId && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
                ⚠️ Bạn phải chọn loại pin theo ô sạc (Loại pin{" "}
                {cabinDetail.batteryTypeId})
              </div>
            )}
        </div>
      ) : (
        <div className="p-6 py-4">
          <p>Chưa có ô sạc</p>
        </div>
      )}

      {/* Form */}
      <form className="flex-1 overflow-auto p-6 pt-2 scrollbar-custom">
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
                const id = Number(e.target.value);
                dispatch(setBatteryTypeId(id));
                dispatch(fetchBatteryTypeDetail(id));
              }}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 w-full"
            >
              <option value={0}>Tìm theo loại pin</option>
              {batteryTypeList.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - Loại pin {type.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Trạng thái</span>
            </label>
            <select
              name="status"
              value={form.status || ""}
              onChange={(e) => {
                handleChange(e);
              }}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 w-full"
            >
              <option value="AVAILABLE">Hoạt động</option>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="CHARGING">Đang sạc</option>
              <option value="RESERVED">Đã đặt</option>
              <option value="IN_USE">Đang được sử dụng</option>
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

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/batteries")}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              (cabinDetail?.batteryTypeId !== undefined &&
                Number(form.batteryTypeId) !== cabinDetail.batteryTypeId)
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Cập nhập pin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
