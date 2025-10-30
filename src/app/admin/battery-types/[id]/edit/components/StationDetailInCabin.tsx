import React from "react";
import { Battery, Building, MapPin } from "lucide-react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

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
        <div className=" rounded-lg">
          <div className="space-y-6">
            {/*Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Mô tả
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {station?.description || "Không có dữ liệu"}
              </div>
            </div>
            {/*Nhiệt độ */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Nhiệt độ
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {station?.temperature || "Không có dữ liệu"}
              </div>
            </div>
            {/*address */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Địa chỉ
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {station?.address || "Không có dữ liệu"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationDetailInCabin;
