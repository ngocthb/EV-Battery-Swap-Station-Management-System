"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCabinetsById } from "@/services/cabinetService";
import { Cabinet } from "@/types";
import {
  MapPin,
  Building,
  ArrowLeft,
  Loader2,
  Battery,
} from "lucide-react";

const ViewForm = ({ cabinId }: { cabinId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cabinDetail, setCabinDetail] = useState<Cabinet | null>(null);

  const fetchCabinById = async () => {
    setLoading(true);
    try {
      const res = await getCabinetsById(cabinId);
      setCabinDetail(res.data);
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

      {/* station */}
      <div className="w-1/2 bg-white flex flex-col">
        {/* Header */}
        <div className="px-6 py-3 mt-1 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Battery className="w-5 h-5 mr-2" />
            Thông tin trạm
          </h2>
          <p className="text-sm text-gray-600 mt-1">Chi tiết trạm</p>
        </div>

        {/* Station Details */}
        <div className="flex-1 overflow-auto p-6">
          {/* Basic Information */}
          <div className=" rounded-lg p-4">
            <div className="space-y-4">
              {/*Tên */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Tên trạm
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {cabinDetail?.station?.name || "Không có dữ liệu"}
                </div>
              </div>
              {/*Description */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  Mô tả
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {cabinDetail?.station?.description || "Không có dữ liệu"}
                </div>
              </div>
              {/*Nhiệt độ */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Nhiệt độ
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {cabinDetail?.station?.temperature || "Không có dữ liệu"}
                </div>
              </div>
              {/*address */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Địa chỉ
                </label>
                <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                  {cabinDetail?.station?.address || "Không có dữ liệu"}
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
