"use client";

import { AdminLayout } from "@/layout/AdminLayout";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Cabinet, Slot } from "@/types";
import { getAllCabinetListAPI } from "@/services/cabinetService";
import { getAllSlotListAPI } from "@/services/slotService";
import {
  getSlotStatusBGAndTextWhiteStyle,
  getSlotStatusText,
} from "@/utils/formateStatus";
import { toast } from "react-toastify";
import axios from "axios";
import api from "@/lib/axios";

export default function BatteryTransferPage() {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [sourceCabinetId, setSourceCabinetId] = useState<number | null>(null);
  const [targetCabinetId, setTargetCabinetId] = useState<number | null>(null);
  const [sourceSlots, setSourceSlots] = useState<Slot[]>([]);
  const [targetSlots, setTargetSlots] = useState<Slot[]>([]);
  const [selectedSourceSlot, setSelectedSourceSlot] = useState<Slot | null>(
    null
  );
  const [selectedTargetSlot, setSelectedTargetSlot] = useState<Slot | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Fetch all cabinets
  useEffect(() => {
    const fetchCabinets = async () => {
      try {
        const res = await getAllCabinetListAPI({});
        setCabinets(res.data || []);
      } catch (error) {
        console.error("Error fetching cabinets:", error);
        toast.error("Không thể tải danh sách tủ pin");
      }
    };
    fetchCabinets();
  }, []);

  const fetchSlots = async (cabinetId: number, type: "source" | "target") => {
    try {
      setLoading(true);
      const res = await getAllSlotListAPI({ cabinetId, limit: 100 });
      const slots = res.data || [];
      if (type === "source") {
        setSourceSlots(slots);
      } else {
        setTargetSlots(slots);
      }
    } catch (error) {
      toast.error(
        `Không thể tải danh sách ô của tủ ${
          type === "source" ? "nguồn" : "đích"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sourceCabinetId) {
      fetchSlots(sourceCabinetId, "source");
    } else {
      setSourceSlots([]);
      setSelectedSourceSlot(null);
    }
  }, [sourceCabinetId]);

  useEffect(() => {
    if (targetCabinetId) {
      fetchSlots(targetCabinetId, "target");
    } else {
      setTargetSlots([]);
      setSelectedTargetSlot(null);
    }
  }, [targetCabinetId]);

  const handleTransfer = async () => {
    if (!selectedSourceSlot || !targetCabinetId) {
      toast.warning("Vui lòng chọn ô nguồn và tủ đích");
      return;
    }

    if (!selectedSourceSlot.batteryId) {
      toast.warning("Ô nguồn không có pin để chuyển");
      return;
    }

    const targetCabinet = cabinets.find((c) => c.id === targetCabinetId);
    const targetStationId = targetCabinet?.stationId;

    if (!targetStationId) {
      toast.error("Không tìm thấy trạm đích");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/request", {
        batteryId: selectedSourceSlot.batteryId,
        newStationId: targetStationId,
      });

      toast.success(
        `Đã chuyển pin #${selectedSourceSlot.batteryId} tới trạm #${targetStationId}`
      );

      // Reload source slots to reflect changes
      if (sourceCabinetId) {
        await fetchSlots(sourceCabinetId, "source");
      }

      // Reset selections
      setSelectedSourceSlot(null);
      setTargetCabinetId(null);
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Không thể chuyển pin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/batteries"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Điều chuyển pin
              </h1>
            </div>
            <p className="text-gray-600 mt-1 ml-8">
              Chọn tủ và ô pin để điều chuyển
            </p>
          </div>
          <button
            onClick={handleTransfer}
            disabled={!selectedSourceSlot || !targetCabinetId || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Xác nhận chuyển</span>
          </button>
        </div>

        {/* Split Screen */}
        <div className="grid grid-cols-2 gap-6">
          {/* Source Cabinet */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Tủ nguồn (chọn pin cần chuyển)
              </h2>
              <select
                value={sourceCabinetId || ""}
                onChange={(e) => {
                  const val = Number(e.target.value) || null;

                  setSourceCabinetId(val);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn tủ nguồn --</option>
                {cabinets.map((cabinet) => {
                  const targetCabinet = cabinets.find(
                    (c) => c.id === targetCabinetId
                  );
                  const isSameStation =
                    targetCabinet &&
                    cabinet.stationId === targetCabinet.stationId;
                  return (
                    <option
                      key={cabinet.id}
                      value={cabinet.id}
                      disabled={isSameStation}
                    >
                      {cabinet.name} - #Pin loại {cabinet.batteryTypeId}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Source Slots Grid */}
            {sourceCabinetId && (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedSourceSlot
                    ? `Đã chọn: ${selectedSourceSlot.name}`
                    : "Chưa chọn ô nào"}
                </p>
                <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
                  {loading ? (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      Đang tải...
                    </div>
                  ) : sourceSlots.length === 0 ? (
                    <div className="col-span-3 text-center py-8 text-gray-400">
                      Không có ô nào
                    </div>
                  ) : (
                    sourceSlots.map((slot) => {
                      const isReserved = String(slot.status) === "RESERVED";
                      const batteryNotInUse =
                        slot.battery && !slot.battery.inUse;
                      const disabledSource =
                        !slot.batteryId || isReserved || batteryNotInUse;
                      return (
                        <button
                          key={slot.id}
                          onClick={() =>
                            setSelectedSourceSlot(
                              selectedSourceSlot?.id === slot.id ? null : slot
                            )
                          }
                          disabled={disabledSource}
                          className={`
                            relative rounded-lg border-2 p-3 transition-all
                            ${
                              selectedSourceSlot?.id === slot.id
                                ? "border-blue-600 ring-2 ring-blue-200"
                                : "border-gray-300"
                            }
                            ${
                              disabledSource
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-md cursor-pointer"
                            }
                            ${getSlotStatusBGAndTextWhiteStyle(slot.status)}
                          `}
                        >
                          <div className="text-center">
                            <p className="font-semibold text-sm">{slot.name}</p>
                            <p className="text-xs mt-1">
                              {getSlotStatusText(slot.status)}
                            </p>
                            {slot.batteryId && (
                              <p className="text-xs mt-1">
                                Pin #{slot.batteryId}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Target Cabinet */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Tủ đích (chỉ xem)
              </h2>
              <select
                value={targetCabinetId || ""}
                onChange={(e) => {
                  const val = Number(e.target.value) || null;

                  setTargetCabinetId(val);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Chọn tủ đích --</option>
                {cabinets.map((cabinet) => {
                  const sourceCabinet = cabinets.find(
                    (c) => c.id === sourceCabinetId
                  );
                  const isSameStation =
                    sourceCabinet &&
                    cabinet.stationId === sourceCabinet.stationId;
                  return (
                    <option
                      key={cabinet.id}
                      value={cabinet.id}
                      disabled={isSameStation}
                    >
                      {cabinet.name} - Pin loại {cabinet.batteryTypeId}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Target Slots Grid */}
            {targetCabinetId && (
              <div>
                <p className="text-sm text-gray-600 mb-12"></p>
                <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
                  {loading ? (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      Đang tải...
                    </div>
                  ) : targetSlots.length === 0 ? (
                    <div className="col-span-3 text-center py-8 text-gray-400">
                      Không có ô nào
                    </div>
                  ) : (
                    targetSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`
                          relative rounded-lg border-2 p-3 cursor-not-allowed opacity-70
                          border-gray-300 min-h-[88px] flex items-center justify-center
                          ${getSlotStatusBGAndTextWhiteStyle(slot.status)}
                        `}
                      >
                        <div className="text-center">
                          <p className="font-semibold text-sm">{slot.name}</p>
                          <p className="text-xs mt-1">
                            {getSlotStatusText(slot.status)}
                          </p>
                          {slot.batteryId && (
                            <p className="text-xs mt-1">
                              Pin #{slot.batteryId}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Summary */}
        {selectedSourceSlot && selectedTargetSlot && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Từ</p>
                <p className="font-semibold text-gray-900">
                  {selectedSourceSlot.name} (Pin #{selectedSourceSlot.batteryId}
                  )
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-blue-600" />
              <div className="text-center">
                <p className="text-sm text-gray-600">Đến</p>
                <p className="font-semibold text-gray-900">
                  {selectedTargetSlot.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
