"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCabinetsById } from "@/services/cabinetService";
import {
  getCabinetByIdAPI,
  getCabinetsByStationId,
} from "@/services/cabinetService";
import { Cabinet, Slot } from "@/types";
import { MapPin, Building, ArrowLeft, Loader2, Battery } from "lucide-react";

const ViewForm = ({ cabinId }: { cabinId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cabinDetail, setCabinDetail] = useState<Cabinet | null>(null);

  const fetchCabinById = async () => {
    setLoading(true);
    try {
      const res = await getCabinetsById(cabinId);

      setCabinDetail(res.data);
      console.log(cabinDetail);
    } catch (error: unknown) {
      console.error("loi fetch cabin detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabinById();
  }, [cabinId, router]);

  if (loading) {
    return (
      <div className="w-1/2 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin tủ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Station Info - Left Side */}
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
                Thông tin tủ sạc
              </h1>
              <p className="text-sm text-gray-600">
                Chi tiết về tủ sạc trong trạm
              </p>
            </div>
          </div>
        </div>

        {/* Cabinet Details */}
        <div className="flex-1 overflow-auto p-6">
          {/* Basic Information */}
          <div className=" rounded-lg p-4">
            <div className="space-y-4">
              {/*Tên */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Tên tủ sạc
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {cabinDetail?.name || "Không có dữ liệu"}
                </div>
              </div>
              {/*Nhiệt độ */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Nhiệt độ
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {cabinDetail?.temperature || "Không có dữ liệu"}
                </div>
              </div>
              {/*Station */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Trạm
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {cabinDetail?.station?.name || "Không có dữ liệu"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Slots */}
      <div className="w-1/2 bg-white flex flex-col">
        {/* Header */}
        <div className="px-6 py-3 mt-1 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Battery className="w-5 h-5 mr-2" />
            Các slot pin
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng: {cabinDetail?.slots?.length || 0} slot
          </p>
        </div>

        {/* Battery Slots Grid */}
        <div className="flex-1 overflow-auto p-6">
          {cabinDetail?.slots && cabinDetail.slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {cabinDetail.slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`
                    relative rounded-lg border-2 p-4 transition-all hover:shadow-md
                    ${
                      slot.status === "CHARGING"
                        ? "border-green-500 bg-green-50"
                        : slot.status === "RESERVED"
                        ? "border-yellow-500 bg-yellow-50"
                        : slot.status === "SWAPPING"
                        ? "border-blue-500 bg-blue-50"
                        : slot.status === "MAINTENANCE"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-gray-50"
                    }
                  `}
                >
                  {/* Slot Number */}
                  <div className="text-center mb-2">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Slot
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      #{slot.id}
                    </div>
                  </div>

                  {/* Battery Icon */}
                  <div className="flex justify-center mb-2">
                    <Battery
                      className={`w-8 h-8 ${
                        slot.status === "CHARGING"
                          ? "text-green-600"
                          : slot.status === "RESERVED"
                          ? "text-yellow-600"
                          : slot.status === "SWAPPING"
                          ? "text-blue-600"
                          : slot.status === "MAINTENANCE"
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Battery ID */}
                  <div className="text-center mb-2">
                    <div className="text-xs text-gray-600">
                      {slot.batteryId ? `Pin #${slot.batteryId}` : "Trống"}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span
                      className={`
                        inline-block px-2 py-1 text-xs font-semibold rounded
                        ${
                          slot.status === "CHARGING"
                            ? "bg-green-600 text-white"
                            : slot.status === "RESERVED"
                            ? "bg-yellow-600 text-white"
                            : slot.status === "SWAPPING"
                            ? "bg-blue-600 text-white"
                            : slot.status === "MAINTENANCE"
                            ? "bg-red-600 text-white"
                            : "bg-gray-400 text-white"
                        }
                      `}
                    >
                      {slot.status === "CHARGING"
                        ? "Đang sạc"
                        : slot.status === "RESERVED"
                        ? "Đã đặt"
                        : slot.status === "SWAPPING"
                        ? "Đang thay"
                        : slot.status === "MAINTENANCE"
                        ? "Bảo trì"
                        : "Trống"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Battery className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Không có slot pin</p>
              <p className="text-sm">Tủ này chưa có slot pin nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
