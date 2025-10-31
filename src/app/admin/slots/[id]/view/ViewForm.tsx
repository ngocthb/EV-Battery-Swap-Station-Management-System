"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Slot } from "@/types";
import {
  ArrowLeft,
  Loader2,
  Battery,
  Clock,
  Activity,
  Zap,
  Info,
  Plug,
} from "lucide-react";
import { getSlotByIdAPI } from "@/services/slotService";
import { formatDateHCM } from "@/utils/format";
import {
  getBatteryStatusStyle,
  getBatteryStatusText,
  getSlotStatusStyle,
  getSlotStatusText,
} from "@/utils/formateStatus";

const ViewForm = ({ slotId }: { slotId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [slotDetail, setSlotDetail] = useState<Slot | null>(null);

  const fetchSlotById = async () => {
    setLoading(true);
    try {
      const res = await getSlotByIdAPI(slotId);
      console.log("slot view", res.data);

      setSlotDetail(res.data);
    } catch (error: unknown) {
      console.error("loi fetch cabin detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotById();
  }, [slotId, router]);


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

  const battery = slotDetail?.battery;

  return (
    <div className="flex h-full bg-gray-50">
      {/* LEFT: Slot Info */}
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/slots")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Thông tin ô sạc
            </h1>
            <p className="text-sm text-gray-500">Chi tiết về ô sạc</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Slot name */}
          <div className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              {slotDetail?.name}
            </span>
          </div>

          {/* Status */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSlotStatusStyle(
                  slotDetail?.status
                )}`}
              >
                {getSlotStatusText(slotDetail?.status)}
              </span>
            </div>
            <div className="text-xs text-gray-400 italic">
              Cập nhật: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Info box */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-xs">Mã tủ</p>
              <p className="font-medium text-gray-800">
                {slotDetail?.cabinetId}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-xs">Pin ID</p>
              <p className="font-medium text-gray-800">
                {slotDetail?.batteryId || "Chưa có pin"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Battery Info */}
      <div className="w-1/2 bg-white flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Battery className="w-5 h-5 mr-2 text-blue-600" />
            Thông tin pin
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {battery ? "Chi tiết về pin đang lắp" : "Ô này hiện chưa có pin."}
          </p>
        </div>

        {battery ? (
          <div className="p-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Model</p>
              <p className="font-medium text-gray-800">{battery.model}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Chu kỳ sạc</p>
              <p className="font-medium text-gray-800">
                {battery.currentCycle} lần
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Dung lượng hiện tại</p>
              <p className="font-medium text-gray-800">
                {battery.currentCapacity}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Độ khỏe pin</p>
              <p className="font-medium text-gray-800">
                {battery?.healthScore}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 col-span-2 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs">Trạng thái pin</p>
                <p
                  className={`font-medium ${getBatteryStatusStyle(
                    battery.status
                  )}`}
                >
                  {getBatteryStatusText(battery?.status)}
                </p>
              </div>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="col-span-2 border-t pt-3 text-xs text-gray-500 space-y-1">
              <p>
                <Clock className="inline w-4 h-4 mr-1 text-gray-400" />
                <span>Lần sạc gần nhất: </span>
                {formatDateHCM(String(battery?.lastChargeTime))}
              </p>
              <p>
                <Activity className="inline w-4 h-4 mr-1 text-gray-400" />
                <span>Dự kiến đầy pin: </span>
                {formatDateHCM(String(battery?.estimatedFullChargeTime))}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Không có pin nào trong ô sạc này.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewForm;
