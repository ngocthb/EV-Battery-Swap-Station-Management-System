"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Battery } from "@/types";
import { MapPin, Building, ArrowLeft, Loader2 } from "lucide-react";
import { getBatteryById } from "@/services/batteryService";

const ViewForm = ({ batteryId }: { batteryId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [batteryDetail, setBatteryDetail] = useState<Battery | null>(null);

  const fetchBatteryById = async () => {
    setLoading(true);
    try {
      const res = await getBatteryById(batteryId);
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

  const getStatusBatteryColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBatteryText = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Hoạt động";
      case "MAINTENANCE":
        return "Bảo trì";
      case "CHARGING":
        return "Đang sạc";
      case "IN_USE":
        return "Đang được sử dụng";
      default:
        return "Không xác định";
    }
  };

  const getStatusBatteryTypeColor = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800";
      case false:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBatteryTypeText = (status: boolean) => {
    switch (status) {
      case true:
        return "Tồn tại";
      case false:
        return "Đã ẩn";
      default:
        return "Không xác định";
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
    <div className="flex h-full">
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
          {/*status */}
          <div className="mb-3">
            <span
              className={`ml-4 px-4 py-2 ${getStatusBatteryColor(
                String(batteryDetail?.status)
              )} rounded-lg`}
            >
              {getStatusBatteryText(String(batteryDetail?.status)) ||
                "Không có dữ liệu"}
            </span>
          </div>
          {/* Basic Information */}
          <div className=" rounded-lg p-4">
            <div className="space-y-4">
              {/*Tên */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Mẫu pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.model || "Không có dữ liệu"}
                </div>
              </div>
              {/*dung lượng */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Dung lượng pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.capacity || "Không có dữ liệu"}
                </div>
              </div>
              {/*Vòng đời */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Vòng đời pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.cycleLife || "Không có dữ liệu"}
                </div>
              </div>

              {/*type */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Loại pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.batteryType?.name || "Không có dữ liệu"}
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
          {/*status */}
          <div className="mb-3">
            <span
              className={`ml-4 px-4 py-2 ${getStatusBatteryTypeColor(
                Boolean(batteryDetail?.batteryType?.status)
              )} rounded-lg`}
            >
              {getStatusBatteryTypeText(
                Boolean(batteryDetail?.batteryType?.status)
              ) || "Không có dữ liệu"}
            </span>
          </div>
          {/* Basic Information */}
          <div className=" rounded-lg p-4">
            <div className="space-y-4">
              {/*Tên */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Tên loại pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.batteryType?.name || "Không có dữ liệu"}
                </div>
              </div>
              {/*Description */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Mô tả
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.batteryType?.description ||
                    "Không có dữ liệu"}
                </div>
              </div>
              {/*Dung lượng */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Dung lượng
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.batteryType?.capacityKWh ||
                    "Không có dữ liệu"}
                </div>
              </div>
              {/*Price per swap */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Gía lần đổi
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryDetail?.batteryType?.pricePerSwap ||
                    "Không có dữ liệu"}
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
