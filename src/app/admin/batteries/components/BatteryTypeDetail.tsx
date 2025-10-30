import React from "react";
import { Battery, Building } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

function BatteryTypeDetail() {
  const batteryType = useSelector(
    (state: RootState) => state.adminDetailState.batteryType.data
  );
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
        <div className="rounded-lg p-4">
          <div className="grid grid-cols-2 gap-6 bg-gray-100 p-4 rounded-lg">
            {/* Tên loại pin */}
            <div>
              <p className="text-sm text-gray-500">Tên loại pin</p>
              <p className="text-base font-medium text-gray-800">
                {batteryType?.name || "Không có dữ liệu"}
              </p>
            </div>

            {/* Mô tả */}
            <div>
              <p className="text-sm text-gray-500">Mô tả</p>
              <p className="text-base font-medium text-gray-800">
                {batteryType?.description || "Không có dữ liệu"}
              </p>
            </div>

            {/* Dung lượng (KWh) */}
            <div>
              <p className="text-sm text-gray-500">Dung lượng (KWh)</p>
              <p className="text-base font-medium text-gray-800">
                {batteryType?.capacityKWh || "Không có dữ liệu"}
              </p>
            </div>

            {/* Giá lần đổi pin (VND) */}
            <div>
              <p className="text-sm text-gray-500">Giá lần đổi pin (VND)</p>
              <p className="text-base font-medium text-gray-800">
                {batteryType?.pricePerSwap
                  ? batteryType.pricePerSwap
                  : "Không có dữ liệu"}
              </p>
            </div>

            {/* cycle */}
            <div>
              <p className="text-sm text-gray-500">Vòng đời pin</p>
              <p className="text-base font-medium text-gray-800">
                {batteryType?.cycleLife
                  ? batteryType.cycleLife
                  : "Không có dữ liệu"}
              </p>
            </div>

            {/* rate */}
            <div>
              <p className="text-sm text-gray-500">Đánh giá sạc</p>
              <p className="text-base font-medium text-gray-800">
                {batteryType?.chargeRate
                  ? batteryType.chargeRate
                  : "Không có dữ liệu"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatteryTypeDetail;
