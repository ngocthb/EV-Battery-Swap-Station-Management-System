import React from "react";
import { Battery, Building } from "lucide-react";
import { useBatteryAdmin } from "../context/BatteryAdminContext";

function BatteryTypeDetail() {
  const { batteryType } = useBatteryAdmin();
  console.log("batteryType detail:", batteryType);
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
  return (
    <div className="w-1/2 bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-3 mt-1 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Battery className="w-5 h-5 mr-2" />
          Thông tin loại pin
        </h2>
        <p className="text-sm text-gray-600 mt-1">Chi tiết loại pin</p>
      </div>

      {/* Station Details */}
      <div className="flex-1 overflow-auto p-6">
        {/* Basic Information */}
        <div className=" rounded-lg">
          <div className="space-y-6">
            {/*Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Tên loại pin
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {batteryType?.name || "Không có dữ liệu"}
              </div>
            </div>
            {/*Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Mô tả
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {batteryType?.description || "Không có dữ liệu"}
              </div>
            </div>
            {/*Capacity */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Dung lượng (KWh)
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {batteryType?.capacityKWh || "Không có dữ liệu"}
              </div>
            </div>
            {/*Price per swap */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Gía lần đổi pin (VND)
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {batteryType?.pricePerSwap || "Không có dữ liệu"}
              </div>
            </div>
            {/*Status*/}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Trạng thái
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900">
                {batteryType?.status !== undefined
                  ? getStatusText(batteryType.status)
                  : "Không có dữ liệu"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatteryTypeDetail;
