"use client";

import React, { useState, useEffect } from "react";
import { Slot } from "@/types";
import { Loader2, Battery, Clock, Activity, Zap, Plug, X } from "lucide-react";
import { getSlotByIdAPI } from "@/services/slotService";
import { formatDateHCM } from "@/utils/format";
import {
  getBatteryStatusStyle,
  getBatteryStatusText,
  getSlotStatusStyle,
  getSlotStatusText,
} from "@/utils/formateStatus";

interface SlotDetailModalProps {
  slotId: number;
  onClose: () => void;
}

const SlotDetailModal = ({ slotId, onClose }: SlotDetailModalProps) => {
  const [loading, setLoading] = useState(true);
  const [slotDetail, setSlotDetail] = useState<Slot | null>(null);

  const fetchSlotById = async () => {
    setLoading(true);
    try {
      const res = await getSlotByIdAPI(slotId);
      setSlotDetail(res.data);
    } catch (error) {
      console.error("Lỗi fetch slot detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotById();
  }, [slotId]);

  const battery = slotDetail?.battery;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">
            Chi tiết ô sạc
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT: Slot Info */}
            <div className="w-1/2 bg-white border-r border-gray-200 p-6 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Plug className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-gray-800">
                  {slotDetail?.name}
                </span>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
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

            {/* RIGHT: Battery Info */}
            <div className="w-1/2 bg-white flex flex-col p-6 overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <Battery className="w-5 h-5 mr-2 text-blue-600" />
                Thông tin pin
              </h2>
              {battery ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                      {battery.healthScore}%
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
                        {getBatteryStatusText(battery.status)}
                      </p>
                    </div>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="col-span-2 border-t pt-3 text-xs text-gray-500 space-y-1">
                    <p>
                      <Clock className="inline w-4 h-4 mr-1 text-gray-400" />
                      <span>Lần sạc gần nhất: </span>
                      {formatDateHCM(String(battery.lastChargeTime))}
                    </p>
                    <p>
                      <Activity className="inline w-4 h-4 mr-1 text-gray-400" />
                      <span>Dự kiến đầy pin: </span>
                      {formatDateHCM(String(battery.estimatedFullChargeTime))}
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
        )}
      </div>
    </div>
  );
};

export default SlotDetailModal;
