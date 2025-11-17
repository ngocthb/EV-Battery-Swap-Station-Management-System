"use client";

import React, { useEffect, useState } from "react";
import { Battery, Clock, Package } from "lucide-react";
import api from "@/lib/axios";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { io, Socket } from "socket.io-client";

interface BatteryType {
  id: number;
  name: string;
}

interface BatteryInfo {
  id: number;
  model: string;
  status?: string;
  healthScore?: number;

  // thêm mới
  batteryTypeId?: number;
  batteryType?: BatteryType;
}

interface Station {
  id: number;
  name: string;
  address: string;
}

interface TransferRequest {
  id: number;
  status: string;
  createdAt: string;
  battery?: BatteryInfo;
  batteries?: BatteryInfo[];
  batteryType?: BatteryType;
  currentStation?: Station;
  newStation?: Station;
}

interface TransferRequestPanelProps {
  stationId?: number;
  selectedBatteryId: number | null;
  onSelectBattery: (batteryId: number | null) => void;
  refreshSignal?: number;
}

export default function TransferRequestPanel({
  stationId,
  selectedBatteryId,
  onSelectBattery,
  refreshSignal,
}: TransferRequestPanelProps) {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    if (!stationId) return;

    try {
      setLoading(true);
      const response = await api.get(`/request/station/${stationId}`, {
        params: { page: 1, limit: 20 },
      });
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId, refreshSignal]);

  const availableBatteries = React.useMemo(() => {
    const items: BatteryInfo[] = [];

    requests.forEach((r) => {
      if (r.status === "TRANSFERRING") {
        const typeId = r.batteryType?.id;
        const typeInfo = r.batteryType;

        // nếu có mảng batteries
        if (Array.isArray(r.batteries)) {
          r.batteries.forEach((b) =>
            items.push({
              ...b,
              batteryTypeId: typeId,
              batteryType: typeInfo,
            })
          );
        }

        // nếu API có field legacy `battery`
        if (r.battery) {
          items.push({
            ...r.battery,
            batteryTypeId: typeId,
            batteryType: typeInfo,
          });
        }
      }
    });

    // dedupe by id
    const map = new Map<number, BatteryInfo>();
    items.forEach((b) => map.set(b.id, b));
    return Array.from(map.values());
  }, [requests]);

  // local copy so we can remove items from UI when user discards a battery
  const [localBatteries, setLocalBatteries] = useState<BatteryInfo[]>([]);

  // sync local copy whenever fetched availableBatteries changes
  React.useEffect(() => {
    setLocalBatteries(availableBatteries);
  }, [availableBatteries]);
  return (
    <div className="bg-white rounded-r-lg shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="p-8 border-b border-gray-200 ">
        <h3 className="font-semibold text-gray-900">Pin khả dụng</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : availableBatteries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Không có pin khả dụng</p>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {localBatteries.map((batt) => {
              const isSelected = selectedBatteryId === batt.id;
              return (
                <div
                  key={batt.id}
                  onClick={() => {
                    if (isSelected) {
                      // if un-selecting an already selected battery, remove it from the list
                      setLocalBatteries((prev) =>
                        prev.filter((p) => p.id !== batt.id)
                      );
                      onSelectBattery(null);
                    } else {
                      onSelectBattery(batt.id);
                    }
                  }}
                  className={`border-2 rounded-lg p-3 relative cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-100 ring-2 ring-blue-300"
                      : "border-green-300 bg-green-50 hover:border-green-400"
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <Battery
                      className={`w-6 h-6 ${
                        isSelected ? "text-blue-600" : "text-green-600"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-700 font-medium">
                      {batt.model}
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      #Pin loại: {batt.batteryType?.id ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sức khỏe: {batt.healthScore ?? "-"}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                      Đã chọn
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
