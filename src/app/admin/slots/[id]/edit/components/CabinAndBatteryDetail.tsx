import React from "react";
import {
  Activity,
  Battery,
  BatteryCharging,
  Building,
  Clock,
  MapPin,
  Repeat,
  Zap,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatDateHCM } from "@/utils/format";

function CabinAndBatteryDetail() {
  const batteryData = useSelector(
    (state: RootState) => state.adminDetailState.battery.data
  );

  const getStatusText = (status: string) => {
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
  return (
    <div className="w-1/2 bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-3 mt-1 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Battery className="w-5 h-5 mr-2" />
          Thông tin pin
        </h2>
        <p className="text-sm text-gray-600 mt-1">Chi tiết</p>
      </div>

      {/* Station Details */}
      <div className="flex-1 overflow-auto p-6">
        {/* Basic Information */}
        <div className="rounded-lg p-4">
          <div className="grid grid-cols-2 gap-6 bg-gray-100 p-4 rounded-lg">
            {/* Mẫu */}
            <div>
              <p className="text-sm text-gray-500">Mẫu pin</p>

              <p className="text-base font-medium text-gray-800">
                {batteryData?.model || "Không có dữ liệu"}
              </p>
            </div>

            {/* Vòng đời hiện tại */}
            <div>
              <p className="text-sm text-gray-500">Vòng đời hiện tại</p>
              <p className="text-base font-medium text-gray-800">
                {batteryData?.currentCycle || "Không có dữ liệu"}
              </p>
            </div>

            {/* Dung lượng hiện tại */}
            <div>
              <p className="text-sm text-gray-500">Dung lượng hiện tại</p>

              <p className="text-base font-medium text-gray-800">
                {batteryData?.currentCapacity || "Không có dữ liệu"}
              </p>
            </div>

            {/* Loại pin */}
            <div>
              <p className="text-sm text-gray-500">Loại pin</p>

              <p className="text-base font-medium text-gray-800">
                {batteryData?.batteryType?.name || "Không có dữ liệu"}
              </p>
            </div>

            {/* Lần sạc cuối */}
            <div>
              <p className="text-sm text-gray-500">Lần sạc cuối</p>

              <p className="text-base font-medium text-gray-800">
                {formatDateHCM(String(batteryData?.lastChargeTime)) ||
                  "Không có dữ liệu"}
              </p>
            </div>

            {/* Trạng thái */}
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className="text-base font-medium text-gray-800">
                {getStatusText(String(batteryData?.status)) ||
                  "Không có dữ liệu"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CabinAndBatteryDetail;
