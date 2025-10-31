import React from "react";
import { Battery, Building, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

function StationDetailInCabin() {
  const station = useSelector(
    (state: RootState) => state.adminDetailState.station.data
  );

  return (
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
        <div className="rounded-lg p-4">
          <div className="grid grid-cols-2 gap-6 bg-gray-100 p-4 rounded-lg">
            {/* Tên */}
            <div>
              <p className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Tên
              </p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {station?.name ? `${station.name}°C` : "Không có dữ liệu"}
              </p>
            </div>

            {/* Mô tả */}
            <div>
              <p className="flex items-center text-sm text-gray-500">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Mô tả
              </p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {station?.description || "Không có dữ liệu"}
              </p>
            </div>

            {/* Địa chỉ */}
            <div className="col-span-2">
              <p className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Địa chỉ
              </p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {station?.address || "Không có dữ liệu"}
              </p>
            </div>

            {/* Tọa độ */}
            <div>
              <p className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Tọa độ
              </p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {station?.latitude
                  ? `${station.latitude} / ${station.longitude}`
                  : "Không có dữ liệu"}
              </p>
            </div>

            {/* Thời gian  */}
            <div>
              <p className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Thời gian hoạt động
              </p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {station?.openTime
                  ? `${station.openTime} - ${station.closeTime}`
                  : "Không có dữ liệu"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationDetailInCabin;
