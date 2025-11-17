"use client";

import React, { useState, useMemo } from "react";
import { Battery } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Req {
  id: number;
  status: string;
  requestedQuantity: number;
  approvedQuantity: number | null;
  note: string | null;
  createdAt: string;
  batteryType?: { id: number; name: string } | null;
  station?: { id: number; name: string } | null;
}

interface Batt {
  id: number;
  model: string;
  currentCapacity?: number;
  batteryType?: { id: number; name: string } | null;
  status?: string;
}

interface Props {
  requests: Req[];
  batteries: Batt[];
  loading: boolean;
  onApproveRequest?: (id: number) => void;
  onRejectRequest?: (id: number, note?: string) => void;
  onSelectBattery?: (ids: number[]) => void;
  selectedBatteryIds?: number[] | null;
}

const WarehousePanel: React.FC<Props> = ({
  requests,
  batteries,
  loading,
  onApproveRequest,
  onRejectRequest,
  onSelectBattery,
  selectedBatteryIds: selectedBatteryIdsProp,
}) => {
  const [internalSelectedBatteryIds, setInternalSelectedBatteryIds] = useState<
    number[]
  >([]);
  const [batteryFilter, setBatteryFilter] = useState<number | "ALL">("ALL");

  const selectedBatteryIds =
    typeof selectedBatteryIdsProp !== "undefined"
      ? selectedBatteryIdsProp ?? []
      : internalSelectedBatteryIds;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "TRANSFERRING":
        return "Đang chuyển";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status || "N/A";
    }
  };

  const getStatusClasses = (status?: string) => {
    switch (status) {
      case "PENDING":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800";
      case "TRANSFERRING":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800";
      case "CANCELLED":
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700";
      default:
        return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700";
    }
  };

  // --- FILTER BATTERIES THEO LOẠI PIN ---
  const filteredBatteries = useMemo(() => {
    if (batteryFilter === "ALL") return batteries;
    return batteries.filter((b) => b.batteryType?.id === batteryFilter);
  }, [batteries, batteryFilter]);

  // --- LẤY DANH SÁCH LOẠI PIN CHO FILTER ---
  const batteryTypes = useMemo(() => {
    const map = new Map<number, string>();
    batteries.forEach((b) => {
      if (b.batteryType) map.set(b.batteryType.id, b.batteryType.name);
    });
    return Array.from(map.entries());
  }, [batteries]);

  return (
    <div className="flex gap-4 h-full">
      {/* Left: Requests */}
      <div className="w-2/3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Yêu cầu cấp pin</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
              <span className="ml-2 text-gray-500">Đang tải...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Chưa có yêu cầu nào
            </div>
          ) : (
            <div>
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          request.status === "COMPLETED"
                            ? "bg-gray-400"
                            : request.status === "PENDING"
                            ? "bg-yellow-500"
                            : request.status === "TRANSFERRING"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold truncate">
                            {request.station?.name || "Không rõ trạm"}
                          </p>
                          <span className={getStatusClasses(request.status)}>
                            {getStatusBadge(request.status)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 truncate">
                          {request.batteryType?.name || "N/A"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Yêu cầu: {request.requestedQuantity} •{" "}
                          {new Date(request.createdAt).toLocaleString("vi-VN")}
                        </p>

                        {request.note && (
                          <p className="text-xs text-gray-500 italic mt-1 truncate">
                            Ghi chú: {request.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {request.status === "PENDING" && (
                      <div className="ml-4 flex items-center space-x-2">
                        <button
                          onClick={() => onApproveRequest?.(request.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => onRejectRequest?.(request.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Warehouse Batteries */}
      <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pin trong kho</h2>
          <p className="text-xs text-gray-500">
            ({filteredBatteries.length} pin)
          </p>
        </div>

        {/* FILTER */}
        <div className="p-3 border-b border-gray-200">
          <select
            value={batteryFilter}
            onChange={(e) =>
              setBatteryFilter(
                e.target.value === "ALL" ? "ALL" : Number(e.target.value)
              )
            }
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="ALL">Tất cả loại pin</option>
            {batteryTypes.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* LIST BATTERIES */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredBatteries.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Không có pin
            </div>
          ) : (
            filteredBatteries.map((battery) => {
              const isDamaged = battery.status === "DAMAGED";
              return (
                <div key={battery.id} className="p-3 hover:bg-gray-50">
                  <label
                    className={`flex items-center space-x-3 w-full ${
                      isDamaged ? "opacity-90" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isDamaged}
                      className={`form-checkbox h-4 w-4 ${
                        isDamaged
                          ? "opacity-50 cursor-not-allowed text-gray-400"
                          : "text-blue-600"
                      }`}
                      checked={selectedBatteryIds.includes(battery.id)}
                      onChange={() => {
                        if (isDamaged) return;
                        const isSelected = selectedBatteryIds.includes(
                          battery.id
                        );
                        const next = isSelected
                          ? selectedBatteryIds.filter((i) => i !== battery.id)
                          : [...selectedBatteryIds, battery.id];

                        setInternalSelectedBatteryIds(next);
                        onSelectBattery?.(next);
                      }}
                    />

                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Battery className="w-4 h-4 text-blue-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isDamaged ? "text-red-600" : ""
                            }`}
                          >
                            {battery.model}
                          </p>
                          <p
                            className={`text-xs ${
                              isDamaged ? "text-red-500" : "text-gray-500"
                            } truncate`}
                          >
                            {battery.batteryType?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end ml-3">
                        <span className="text-sm">
                          {battery.currentCapacity ?? "-"}%
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded mt-1 ${
                            battery.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : battery.status === "DAMAGED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {battery.status === "AVAILABLE"
                            ? "Sẵn sàng"
                            : battery.status === "DAMAGED"
                            ? "Hỏng"
                            : battery.status}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehousePanel;
