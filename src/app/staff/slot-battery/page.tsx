"use client";
import { StaffLayout } from "@/layout/StaffLayout";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Battery, Eye, Plus } from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { Cabinet, QueryParams, Slot, Station } from "@/types";
import { getStationById } from "@/services/stationService";

import { getAllSlotListAPI } from "@/services/slotService";
import { getCabinetsByStationId } from "@/services/cabinetService";
// use cabinet list to populate battery type options
import FilterSearch from "./component/FilterSearch";
import {
  getSlotStatusBGAndTextWhiteStyle,
  getSlotStatusBorderAndBgStyle,
  getSlotStatusText,
  getSlotStatusTextStyle,
} from "@/utils/formateStatus";

import SlotDetailModal from "./component/SlotDetailModal";
import TransferRequestPanel from "./component/TransferRequestPanel";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

interface TransferRequest {
  id: number;
  status: string;
  battery: {
    id: number;
  };
  currentStation: {
    id: number;
  };
  newStation: {
    id: number;
  };
}

function SlotAndBattery() {
  const [station, setStation] = useState<Station | null>(null);
  const stationId = useSelector((state: any) => state?.auth?.user?.stationId);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [outgoingRequests, setOutgoingRequests] = useState<TransferRequest[]>(
    []
  );
  const [selectedBatteryId, setSelectedBatteryId] = useState<number | null>(
    null
  );
  const [requestsRefreshSignal, setRequestsRefreshSignal] = useState<number>(0);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [selectedBatteryTypeId, setSelectedBatteryTypeId] = useState<
    number | null
  >(null);
  const [requestQuantity, setRequestQuantity] = useState<number>(1);

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 12,
    search: "",
    status: "",
    cabinetId: undefined,
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.status, query.cabinetId, debouncedSearch]
  );

  // 1. fetch all slot
  const {
    data: slotList = [],
    loading,
    refresh,
  } = useFetchList<Slot[], QueryParams>(getAllSlotListAPI, debouncedQuery);

  // 2. fetch all cabin để query
  const fetchCabinetsByStation = useCallback(async (id?: number) => {
    if (!id) return Promise.resolve({ data: [] } as any);
    return getCabinetsByStationId(id);
  }, []);

  const { data: cabinList = [] } = useFetchList<Cabinet[], number>(
    fetchCabinetsByStation,
    stationId
  );

  // Set default cabinetId to first cabinet of station
  useEffect(() => {
    if (cabinList.length > 0 && !query.cabinetId) {
      updateQuery({ cabinetId: cabinList[0].id });
    }
  }, [cabinList]);

  // 3. fetch station khi có cabinId để bt trạm nào
  const fetchStationDetail = async (id: number) => {
    try {
      const res = await getStationById(id);
      setStation(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (slotList.length > 0) {
      const stationId = slotList[0]?.cabinet?.stationId;
      if (stationId) {
        fetchStationDetail(stationId);
      }
    }
  }, [slotList, query.cabinetId]);

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangStatus = (data: string) => {
    updateQuery({ status: data });
  };

  // Check if slot needs "Lấy pin" button
  const needsTakeBatteryButton = (slot: Slot) => {
    if (!slot.batteryId) return false;

    if (slot.status === "DAMAGED_BATTERY") return true;

    const hasOutgoingRequest = outgoingRequests.some(
      (req) => req.battery.id === slot.batteryId
    );

    return hasOutgoingRequest;
  };

  // Handle put battery into empty slot
  const handlePutBattery = async (slotId: number) => {
    if (!selectedBatteryId) {
      toast.warning("Vui lòng chọn pin từ danh sách bên phải");
      return;
    }

    try {
      await api.post("/transfer-battery/put-battery", {
        slotId: slotId,
        batteryId: selectedBatteryId,
      });
      refresh();
      setSelectedBatteryId(null);
      // trigger right panel to refetch requests immediately
      setRequestsRefreshSignal((s) => s + 1);
      toast.success("Đã bỏ pin vào slot thành công!");
    } catch (error) {
      toast.error("Pin không phù hợp với tủ pin này!");
    }
  };

  // Handle take battery from slot
  const handleTakeBattery = async (slotId: number) => {
    try {
      await api.post("/transfer-battery/take-battery", {
        slotId: slotId,
      });
      refresh();
      toast.success("Đã lấy pin ra khỏi slot thành công!");
    } catch (error) {
      toast.error("Lỗi khi lấy pin ra khỏi slot");
    }
  };

  // Create supply request handlers
  const handleCreateRequest = async () => {
    if (!selectedBatteryTypeId || !requestQuantity) {
      toast.warning(
        "Vui lòng chọn loại pin, số lượng và đảm bảo bạn thuộc một trạm"
      );
      return;
    }

    try {
      const payload = {
        batteryTypeId: Number(selectedBatteryTypeId),
        quantity: Number(requestQuantity),
        stationId: Number(stationId),
      };

      await api.post("/request", payload);
      toast.success("Tạo yêu cầu thêm pin thành công");
      setShowCreateRequestModal(false);
    } catch (err) {
      console.error("Error creating request", err);
      toast.error("Không thể tạo yêu cầu, thử lại sau");
    }
  };

  console.log(cabinList);
  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Ô sạc</h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả các ô sạc pin trong hệ thống
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                // preselect first cabinet's battery type if available
                if (cabinList && cabinList.length > 0) {
                  setSelectedBatteryTypeId(cabinList[0].batteryTypeId || null);
                }
                setShowCreateRequestModal(true);
              }}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Tạo yêu cầu thêm pin</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 ">
          {/* Main Slot Grid - 3/4 width */}
          <div className="col-span-4 bg-white rounded-l-lg shadow-sm border border-gray-100">
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={slotList.length}
              showCabin={true}
              cabinList={cabinList}
              onSearch={handleSearch}
              onChangeStatus={handleChangStatus}
              onUpdateQuery={updateQuery}
              onReset={() =>
                updateQuery({
                  page: 1,
                  limit: 10,
                  search: "",
                  order: "asc",
                  status: "",
                  cabinetId: 1,
                })
              }
            />

            <p className="p-4 pb-0 font-semibold text-xl">{station?.name}</p>

            {/* slot grid */}
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                {slotList.map((slot) => (
                  <div
                    key={slot.id}
                    className={` group 
                      relative rounded-lg border-2 p-4 transition-all hover:shadow-md 
                      ${getSlotStatusBorderAndBgStyle(slot?.status)}
                    `}
                  >
                    {/* Slot Number */}
                    <div className="text-center mb-2">
                      <p className="text-md font-medium mb-1">
                        <b className="text-black">{slot.name}</b>
                      </p>
                    </div>

                    {/* Battery Icon */}
                    <div className="flex justify-center mb-2">
                      <Battery
                        className={`w-8 h-8 ${getSlotStatusTextStyle(
                          slot?.status
                        )}`}
                      />
                    </div>

                    {/* Battery ID */}
                    <div className="text-center mb-2">
                      <div className="text-xs text-gray-600">
                        {slot.batteryId
                          ? `Pin #${slot.batteryId} - ${slot?.battery?.model} (Loại pin ${slot?.battery?.batteryTypeId})`
                          : "Trống"}
                      </div>
                      {slot?.battery?.healthScore && (
                        <div className="text-xs text-gray-600 mt-1">
                          Sức khỏe pin: {slot.battery.healthScore}%
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <span
                        className={`
                          inline-block px-2 py-1 text-xs font-semibold rounded
                          ${getSlotStatusBGAndTextWhiteStyle(slot?.status)}
                        `}
                      >
                        {getSlotStatusText(slot?.status)}
                      </span>
                    </div>

                    {/* Take Battery Button */}
                    {needsTakeBatteryButton(slot) && (
                      <div className="mt-2">
                        <button
                          onClick={() => handleTakeBattery(slot.id)}
                          className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Lấy pin
                        </button>
                      </div>
                    )}

                    {/* Put Battery Button for Empty Slots */}
                    {slot.status === "EMPTY" && (
                      <div className="mt-2">
                        <button
                          onClick={() => handlePutBattery(slot.id)}
                          disabled={!selectedBatteryId}
                          className="w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {selectedBatteryId ? "Bỏ pin vào" : "Chọn pin trước"}
                        </button>
                      </div>
                    )}

                    {/*action list */}
                    <div
                      className="absolute right-2 top-4 flex flex-col gap-3
    opacity-0 translate-y-2
    transition-all duration-200 ease-out
    group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      <span
                        onClick={() => {
                          setSelectedSlotId(slot.id);
                        }}
                      >
                        <Eye
                          size={20}
                          color="blue"
                          className="cursor-pointer"
                        />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <TransferRequestPanel
              stationId={stationId}
              selectedBatteryId={selectedBatteryId}
              onSelectBattery={setSelectedBatteryId}
              refreshSignal={requestsRefreshSignal}
            />
          </div>
        </div>
      </div>

      {/* Create supply request modal */}
      {showCreateRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Tạo yêu cầu thêm pin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Loại pin
                </label>
                <select
                  value={selectedBatteryTypeId ?? ""}
                  onChange={(e) =>
                    setSelectedBatteryTypeId(Number(e.target.value) || null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {cabinList.map((cab: any) => (
                    <option key={cab.id} value={cab.batteryTypeId}>
                      {cab.name} - Loại pin {cab.batteryTypeId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Số lượng pin yêu cầu
                </label>
                <input
                  type="number"
                  min={1}
                  value={requestQuantity}
                  onChange={(e) =>
                    setRequestQuantity(Number(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowCreateRequestModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateRequest}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Tạo yêu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSlotId && (
        <SlotDetailModal
          slotId={selectedSlotId}
          onClose={() => setSelectedSlotId(null)}
        />
      )}
    </StaffLayout>
  );
}

export default SlotAndBattery;
