"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BatteryType, VehicleType } from "@/types";
import { MapPin, Building, ArrowLeft, Loader2, Battery } from "lucide-react";
import { getBatteryTypeById } from "@/services/batteryTypeService";
import { getVehicleTypeById } from "@/services/vehicleService";

const ViewForm = ({ vehicleTypeId }: { vehicleTypeId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vehicleTypeDetail, setVehicleTypeDetail] =
    useState<VehicleType | null>(null);

  const fetchVehicleTypeById = async () => {
    setLoading(true);
    console.log(vehicleTypeId);
    try {
      const res = await getVehicleTypeById(vehicleTypeId);

      setVehicleTypeDetail(res.data);
    } catch (error: unknown) {
      console.error("loi fetch vehicle type detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleTypeById();
  }, [vehicleTypeId, router]);

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800";
      case false:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: boolean) => {
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
          <p className="text-gray-600">Đang tải thông tin...</p>
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
              onClick={() => router.push("/admin/vehicle-types")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Thông tin loại phương tiện
              </h1>
              <p className="text-sm text-gray-600">
                Chi tiết về loại phương tiện
              </p>
            </div>
          </div>
        </div>

        {/* Cabinet Details */}
        <div className="flex-1 overflow-auto p-6">
          {/*status */}
          <div className="mb-3">
            <span
              className={`ml-4 px-4 py-2 ${getStatusColor(
                Boolean(vehicleTypeDetail?.status)
              )} rounded-lg`}
            >
              {getStatusText(Boolean(vehicleTypeDetail?.status)) ||
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
                  Tên loại phương tiện
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {vehicleTypeDetail?.model || "Không có dữ liệu"}
                </div>
              </div>

              {/*Mô tả */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Mô tả loại phương tiện
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {vehicleTypeDetail?.description || "Không có dữ liệu"}
                </div>
              </div>
              {/*pin */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Loại pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {vehicleTypeDetail?.batteryTypeName || "Không có dữ liệu"}
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
