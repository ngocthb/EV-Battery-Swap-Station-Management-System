"use client";
import { StaffLayout } from "@/layout/StaffLayout";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Edit, Battery, Eye } from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { Cabinet, QueryParams, Slot, Station } from "@/types";
import { getStationById } from "@/services/stationService";

import { getAllSlotListAPI } from "@/services/slotService";
import { getAllCabinetListAPI } from "@/services/cabinetService";
import FilterSearch from "./component/FilterSearch";
import { getSlotStatusText } from "@/utils/formateStatus";
import StatsList from "./component/StatsList";
import SlotDetailModal from "./component/SlotDetailModal";

function SlotAndBattery() {
  const [station, setStation] = useState<Station | null>(null);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 12,
    search: "",
    order: "asc",
    status: "",
    cabinetId: 1,
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [
      query.page,
      query.limit,
      query.order,
      query.status,
      query.cabinetId,
      debouncedSearch,
    ]
  );

  // 1. fetch all slot
  const {
    data: slotList = [],
    loading,
    refresh,
  } = useFetchList<Slot[], QueryParams>(getAllSlotListAPI, debouncedQuery);

  // 2. fetch all cabin để query
  const { data: cabinList = [] } =
    useFetchList<Cabinet[]>(getAllCabinetListAPI);

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
  // end fetch station

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangStatus = (data: string) => {
    updateQuery({ status: data });
  };
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
        </div>

        {/* Stats Cards */}
        <StatsList slotList={slotList} />

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
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
                      ${
                        slot.status === "AVAILABLE"
                          ? "border-green-500 bg-green-50"
                          : slot.status === "CHARGING"
                          ? "border-yellow-500 bg-yellow-50"
                          : slot.status === "SWAPPING"
                          ? "border-purple-500 bg-purple-50"
                          : slot.status === "MAINTENANCE"
                          ? "border-red-500 bg-red-50"
                          : slot.status === "RESERVED"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50"
                      }
                    `}
                >
                  {/* Slot Number */}
                  <div className="text-center mb-2">
                    <p className="text-md font-medium mb-1">
                      Slot <b className="text-black">{slot.id}</b>
                    </p>
                  </div>

                  {/* Battery Icon */}
                  <div className="flex justify-center mb-2">
                    <Battery
                      className={`w-8 h-8 ${
                        slot.status === "AVAILABLE"
                          ? "text-green-600"
                          : slot.status === "CHARGING"
                          ? "text-yellow-600"
                          : slot.status === "SWAPPING"
                          ? "text-purple-600"
                          : slot.status === "MAINTENANCE"
                          ? "text-red-600"
                          : slot.status === "RESERVED"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Battery ID */}
                  <div className="text-center mb-2">
                    <div className="text-xs text-gray-600">
                      {slot.batteryId
                        ? `Pin #${slot.batteryId} - ${slot?.battery?.model} (Loại pin ${slot?.battery?.batteryTypeId})`
                        : "Trống"}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span
                      className={`
                          inline-block px-2 py-1 text-xs font-semibold rounded
                          ${
                            slot.status === "AVAILABLE"
                              ? "bg-green-600 text-white"
                              : slot.status === "CHARGING"
                              ? "bg-yellow-600 text-white"
                              : slot.status === "SWAPPING"
                              ? "bg-purple-600 text-white"
                              : slot.status === "MAINTENANCE"
                              ? "bg-red-600 text-white"
                              : slot.status === "RESERVED"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-400 text-white"
                          }
                        `}
                    >
                      {getSlotStatusText(slot?.status)}
                    </span>
                  </div>

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
                      <Eye size={20} color="blue" className="cursor-pointer" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
