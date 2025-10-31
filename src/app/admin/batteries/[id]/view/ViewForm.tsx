"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Battery as IBattery } from "@/types";
import {
  MapPin,
  Building,
  ArrowLeft,
  Loader2,
  BarChart3,
  Battery,
  Layers,
  Tag,
  Bike,
  Zap,
  DollarSign,
  FileText,
} from "lucide-react";
import { getBatteryById } from "@/services/batteryService";
import {
  getBatteryStatusBackground,
  getBatteryStatusText,
  getBatteryTypeStatusBackground,
  getBatteryTypeStatusText,
} from "@/utils/formateStatus";

const ViewForm = ({ batteryId }: { batteryId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [batteryDetail, setBatteryDetail] = useState<IBattery | null>(null);

  const fetchBatteryById = async () => {
    setLoading(true);
    try {
      const res = await getBatteryById(batteryId);
      console.error("loi fetch battery detail: res", res.data);

      setBatteryDetail(res.data);
    } catch (error: unknown) {
      console.error("loi fetch battery detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteryById();
  }, [batteryId, router]);

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
    <div className="flex">
      {/* battery Info - Left Side */}
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
                Thông tin pin
              </h1>
              <p className="text-sm text-gray-600">
                Chi tiết về pin trong trạm
              </p>
            </div>
          </div>
        </div>

        {/* battery Details */}
        <div className="flex-1 overflow-auto p-6">
          {/* Trạng thái pin */}
          <div className="mb-3">
            <span
              className={`ml-4 px-4 py-2 ${getBatteryStatusBackground(
                String(batteryDetail?.status)
              )} rounded-lg`}
            >
              {getBatteryStatusText(String(batteryDetail?.status)) ||
                "Không có dữ liệu"}
            </span>
          </div>

          {/* Thông tin cơ bản */}
          <div className="rounded-lg p-4">
            <div className="grid grid-cols-2 gap-6 bg-gray-100 p-4 rounded-lg">
              {/* Mẫu pin */}
              <div className="flex items-center space-x-3">
                <Battery className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Mẫu pin</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.model || "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Dung lượng pin */}
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Dung lượng pin</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.currentCapacity
                      ? `${batteryDetail.currentCapacity}%`
                      : "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Vòng đời pin */}
              <div className="flex items-center space-x-3">
                <Layers className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Vòng đời pin</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.currentCycle
                      ? `${batteryDetail.currentCycle} chu kỳ`
                      : "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Loại pin */}
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Loại pin</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.batteryType?.name || "Chưa có"}
                  </p>
                </div>
              </div>

              {/* Thuộc xe người dùng */}
              <div className="flex items-center space-x-3">
                <Bike className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Thuộc xe người dùng</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.userVehicleId || "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Thuộc ô / tủ */}
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Vị trí</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.slot?.name || "Không có dữ liệu"}{" "}
                    {batteryDetail?.slot?.cabinetId &&
                      `- Tủ ${batteryDetail.slot.cabinetId}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* battery type */}
      <div className="w-1/2 bg-white flex flex-col">
        {/* Header */}
        <div className="px-6 py-3 mt-1 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            Thông tin loại pin
          </h2>
          <p className="text-sm text-gray-600 mt-1">Chi tiết loại pin</p>
        </div>

        {/* battery type Details */}
        <div className="flex-1 overflow-auto p-6">
          {/* Trạng thái */}
          <div className="mb-3">
            <span
              className={`ml-4 px-4 py-2 ${getBatteryTypeStatusBackground(
                Boolean(batteryDetail?.batteryType?.status)
              )} rounded-lg`}
            >
              {getBatteryTypeStatusText(
                Boolean(batteryDetail?.batteryType?.status)
              ) || "Không có dữ liệu"}
            </span>
          </div>

          {/* Thông tin cơ bản */}
          <div className="rounded-lg p-4">
            <div className="grid grid-cols-2 gap-6 bg-gray-100 p-4 rounded-lg">
              {/* Tên loại pin */}
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Tên loại pin</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.batteryType?.name || "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Dung lượng (KWH) */}
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Dung lượng (KWH)</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.batteryType?.capacityKWh ||
                      "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Giá mỗi lần đổi */}
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-500">Giá mỗi lần đổi (VND)</p>
                  <p className="text-base font-medium text-gray-800">
                    {batteryDetail?.batteryType?.pricePerSwap
                      ? Number(
                          batteryDetail.batteryType.pricePerSwap
                        ).toLocaleString("vi-VN")
                      : "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Mô tả */}
              <div className="col-span-2 flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Mô tả</p>
                  <p className="text-base font-medium text-gray-800 whitespace-pre-line">
                    {batteryDetail?.batteryType?.description ||
                      "Không có dữ liệu"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
