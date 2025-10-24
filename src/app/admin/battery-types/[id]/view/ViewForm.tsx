"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BatteryType } from "@/types";
import { MapPin, Building, ArrowLeft, Loader2, Battery } from "lucide-react";
import { getBatteryTypeById } from "@/services/batteryTypeService";

const ViewForm = ({ batteryTypeId }: { batteryTypeId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [batteryTypeDetail, setBatteryTypeDetail] =
    useState<BatteryType | null>(null);

  const fetchBatteryTypeById = async () => {
    setLoading(true);
    console.log(batteryTypeId)
    try {
      const res = await getBatteryTypeById(batteryTypeId);

      setBatteryTypeDetail(res.data);
      console.log(batteryTypeDetail);
    } catch (error: unknown) {
      console.error("loi fetch battery type detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteryTypeById();
  }, [batteryTypeId, router]);

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
              onClick={() => router.push("/admin/cabins")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Thông tin loại pin
              </h1>
              <p className="text-sm text-gray-600">Chi tiết về loại pin</p>
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
                  Tên loại pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryTypeDetail?.name || "Không có dữ liệu"}
                </div>
              </div>

              {/*Mô tả */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Mô tả loại pin
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {batteryTypeDetail?.description || "Không có dữ liệu"}
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
