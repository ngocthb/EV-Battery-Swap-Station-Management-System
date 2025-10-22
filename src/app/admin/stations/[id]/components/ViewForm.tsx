"use client";

import React, { useState, useEffect } from "react";
import { getStationById } from "@/services/stationService";
import { useRouter } from "next/navigation";
import { getCabinetsById } from "@/services/cabinetService";
import { Station, Cabinet } from "@/types";
import {
  MapPin,
  FileText,
  Building,
  ArrowLeft,
  Loader2,
  Battery,
  Thermometer,
} from "lucide-react";

interface ViewFormProps {
  stationId: number;
}

const ViewForm: React.FC<ViewFormProps> = ({ stationId }) => {
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(null);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        const stationResponse = await getStationById(stationId);
        const cabinetResponse = await getCabinetsById(stationId);

        if (stationResponse.success) {
          setStation(stationResponse.data);
        }

        if (cabinetResponse.success) {
          setCabinets(cabinetResponse.data || []);
        }
      } catch (error: unknown) {
        console.error("Error fetching station or cabinets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationData();
  }, [stationId, router]);

  if (loading) {
    return (
      <div className="w-1/2 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin trạm...</p>
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
              onClick={() => router.push("/admin/stations")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Thông tin trạm sạc
              </h1>
              <p className="text-sm text-gray-600">
                Chi tiết về trạm sạc trong hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Station Details */}
        <div className="flex-1 overflow-auto p-6">
          <div>
            {/* Basic Information */}
            <div className=" rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 mr-2 text-gray-500" />
                    Tên trạm sạc
                  </label>
                  <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                    {station?.name || "Không có dữ liệu"}
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    Mô tả
                  </label>
                  <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 min-h-[80px]">
                    {station?.description || "Không có dữ liệu"}
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    Địa chỉ
                  </label>
                  <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                    {station?.address || "Không có dữ liệu"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vĩ độ (Latitude)
                    </label>
                    <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                      {station?.latitude || "0.000000"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kinh độ (Longitude)
                    </label>
                    <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                      {station?.longitude || "0.000000"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cabinets List - Right Side */}
      <div className="w-1/2 bg-white flex flex-col">
        {/* Header */}
        <div className="px-6 py-3 mt-1 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Battery className="w-5 h-5 mr-2" />
            Danh sách tủ pin ({cabinets.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tất cả tủ pin thuộc trạm này
          </p>
        </div>

        {/* Cabinet List */}
        <div className="flex-1 overflow-auto p-6">
          {cabinets.length > 0 ? (
            <div className="space-y-4">
              {cabinets.map((cabinet, index) => (
                <div
                  key={cabinet.id || index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900 flex items-center">
                      <Battery className="w-4 h-4 mr-2 text-blue-600" />
                      {cabinet.name || `Tủ pin #${index + 1}`}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cabinet.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cabinet.status ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Thermometer className="w-4 h-4 mr-1" />
                    <span>Nhiệt độ: {cabinet.temperature}°C</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Battery className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Không có tủ pin nào</p>
              <p className="text-sm">Trạm này chưa có tủ pin được cài đặt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
