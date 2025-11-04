"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/layout/AdminLayout";
import { MapPin, Edit, Battery, Eye } from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { Cabinet, QueryParams, Slot, Station } from "@/types";
import { getStationById } from "@/services/stationService";

import { getAllSlotListAPI } from "@/services/slotService";
import FilterSearch from "./components/FilterSearch";
import { getAllCabinetListAPI } from "@/services/cabinetService";
import StatsList from "./components/StatsList";
import {
  getSlotStatusBGAndTextWhiteStyle,
  getSlotStatusBorderAndBgStyle,
  getSlotStatusText,
  getSlotStatusTextStyle,
} from "@/utils/formateStatus";

export default function SlotPage() {
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(null);

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
    <AdminLayout>
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
                      ${getSlotStatusBorderAndBgStyle(slot?.status)}
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
                      {getSlotStatusText(slot.status)}
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
                      onClick={() => router.push(`/admin/slots/${slot.id}`)}
                    >
                      <Eye size={20} color="blue" className="cursor-pointer" />
                    </span>
                    <span
                      onClick={() =>
                        router.push(`/admin/slots/${slot.id}/edit`)
                      }
                    >
                      <Edit
                        size={20}
                        color="green"
                        className="cursor-pointer"
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
