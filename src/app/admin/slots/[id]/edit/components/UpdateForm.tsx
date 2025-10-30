"use client";

import React, { useState, useEffect } from "react";
import { getAllStationList, updateStation } from "@/services/stationService";
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
import { Battery, BatteryType, Cabinet, Station } from "@/types";
import {
  getAllCabinetListAPI,
  getCabinetByIdAPI,
  getCabinetsById,
  updateCabinetAPI,
} from "@/services/cabinetService";
// import { useCabinAdmin } from "../../../context/CabinAdminContext";
import {
  getAllBatteryTypeListAPI,
  getBatteryTypeById,
} from "@/services/batteryTypeService";
import {
  getAllBatteryByTypeAPI,
  getAllBatteryListAPI,
} from "@/services/batteryService";
import { getSlotByIdAPI, updateSlotAPI } from "@/services/slotService";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchBatteryDetail,
  fetchCabinDetail,
  setBatteryId,
  setCabinId,
} from "@/store/slices/adminDetailStateSlice";

interface FormErrors {
  name?: string;
  cabinetId?: string;
  batteryId?: string;
  status?: string;
}
interface UpdateFormProps {
  slotId: number;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ slotId }) => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    cabinetId: 0,
    batteryId: 0,
    status: "",
  });

  console.log("form", form);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [batteryTypeDetail, setBatteryTypeDetail] =
    useState<BatteryType | null>(null);
  const [batteryList, setBatteryList] = useState<Battery[] | null>(null);
  const [batteryOfSlot, setBatteryOfSlot] = useState<Battery | null>(null);

  const { data: cabinList = [] } =
    useFetchList<Cabinet[]>(getAllCabinetListAPI);

  // 1. vô lấy slot detail liền
  const fetchSlotById = async () => {
    setLoading(true);
    try {
      const res = await getSlotByIdAPI(slotId);
      console.log("slot detail", res.data);
      setForm({
        name: res.data?.name,
        cabinetId: res.data?.cabinetId,
        batteryId: res.data?.batteryId,
        status: res.data?.status,
      });
      setBatteryOfSlot(res.data.battery);

      const batteryId = res.data?.batteryId;
      dispatch(setBatteryId(batteryId));
      dispatch(fetchBatteryDetail(batteryId));
    } catch (error: unknown) {
      console.error("loi fetch cabin detail:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSlotById();
  }, [slotId, router]);
  // end 1 fetch slot

  // 2. get cabin detail khi có form.cabinId để lấy đc battery type và lấy battery list theo type
  const handleGetCabinDetail = async () => {
    try {
      // 2.1
      const res = await getCabinetByIdAPI(form.cabinetId);

      // 2.2
      const batteryType = await getBatteryTypeById(res.data.batteryTypeId);
      setBatteryTypeDetail(batteryType.data);

      // 2.3
      const batteryListRes = await getAllBatteryByTypeAPI(
        res.data.batteryTypeId,
        { page: 0, limit: 0, search: "" }
      );
      // 2.4 filter 1 lần nữa
      const newBatteryList = batteryListRes.data.filter(
        (item: Battery) =>
          item.slotId == 0 ||
          (item.slotId == null && item.userVehicleId == null)
      );
      // 2.5 thêm battery của slot vô battery list
      if (
        batteryOfSlot &&
        !newBatteryList.some((b: Battery) => b.id === batteryOfSlot.id)
      ) {
        newBatteryList.unshift(batteryOfSlot);
      }

      setBatteryList(newBatteryList);
    } catch (error) {
      console.log("get cabin detail err", error);
    }
  };
  useEffect(() => {
    if (form.cabinetId === 0) return;
    handleGetCabinDetail();
  }, [form]);
  // end get cabin detail

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên ô sạc không được để trống";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Tên ô sạc phải có ít nhất 2 ký tự";
    }

    if (!form.cabinetId || form.cabinetId <= 0) {
      newErrors.cabinetId = "Vui lòng chọn tủ";
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
        type === "number" || name === "cabinetId" || name === "batteryId"
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
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log("update slot form", form);
      const response = await updateSlotAPI(slotId, form);

      if (response.success) {
        toast.success(response.message);
      } else {
        setError(response.message);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Cập nhật ô thất bại";
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
          <p className="text-gray-600">Đang tải thông tin ô...</p>
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
            onClick={() => router.push("/admin/slots")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Cập nhật ô sạc
            </h1>
            <p className="text-sm text-gray-600">
              Cập nhật thông tin ô sạc trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/*cabinet */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Tủ pin /</span>
              {batteryTypeDetail && (
                <span>
                  Loại pin: {batteryTypeDetail?.id} - {batteryTypeDetail?.name}
                </span>
              )}
            </label>
            <select
              name="cabinetId"
              value={Number(form.cabinetId || 0)}
              onChange={(e) => {
                handleChange(e);
                const id = Number(e.target.value);
                dispatch(setCabinId(id));
                dispatch(fetchCabinDetail(id));
              }}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 w-full"
            >
              <option value={0}>Chọn tủ</option>
              {cabinList.map((cabin) => (
                <option key={cabin.id} value={cabin.id}>
                  {cabin.name}
                </option>
              ))}
            </select>
          </div>
          {/* Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              <span>Tên ô sạc</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="VD: Ô 123"
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
              <span>Pin</span>
            </label>
            <select
              name="batteryId"
              value={Number(form.batteryId || 0)}
              onChange={(e) => {
                handleChange(e);
                const id = Number(e.target.value);
                dispatch(setBatteryId(id));
                dispatch(fetchBatteryDetail(id));
              }}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 w-full"
            >
              {/* {batteryOfSlot ? (
                <option value={form.batteryId}>
                  {batteryOfSlot.model} - Loại pin{" "}
                  {batteryOfSlot?.batteryTypeId}
                </option>
              ) : (
                <option value={0}>Chọn pin</option>
              )} */}
              {batteryList?.map((battery) => (
                <option key={battery.id} value={battery.id}>
                  {battery.model} - {battery?.batteryType?.name}
                </option>
              ))}
            </select>
          </div>

          {/*status */}
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
              <option value="SWAPPING">Đang đổi</option>
              <option value="EMPTY">Chưa có pin</option>
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
            onClick={() => router.push("/admin/slots")}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
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
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Cập nhập ô</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
