"use client";

import React, { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";
import { ArrowRight, Battery, MapPin } from "lucide-react";
import type { QueryParams } from "@/types";
import api from "@/lib/axios";

interface BatteryType {
  id: number;
  name: string;
}

interface Battery {
  id: number;
  model: string;
  currentCycle: number;
  healthScore: number;
  status: string;
  inUse: boolean;
  batteryType: BatteryType;
}

interface Station {
  id: number;
  name: string;
  address: string;
}

interface TransferRequest {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  battery: Battery;
  currentStation: Station;
  newStation: Station;
}

interface TransferHistoryResponse {
  data: TransferRequest[];
}

const getTransferHistoryAPI = async (
  params?: QueryParams
): Promise<TransferHistoryResponse> => {
  const response = await api.get("/request", { params });
  return response.data;
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: "bg-yellow-100 text-yellow-800", text: "Đang chờ" },
    APPROVED: { bg: "bg-green-100 text-green-800", text: "Đã duyệt" },
    REJECTED: { bg: "bg-red-100 text-red-800", text: "Từ chối" },
    COMPLETED: { bg: "bg-blue-100 text-blue-800", text: "Hoàn thành" },
  };
  const config = statusMap[status] || {
    bg: "bg-gray-100 text-gray-800",
    text: status,
  };
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg}`}
    >
      {config.text}
    </span>
  );
};

export default function TransferHistoryTab() {
  const { query, updateQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
  });

  const debouncedQuery = useMemo(
    () => ({ ...query }),
    [query.page, query.limit]
  );

  const { data: transferList = [], loading } = useFetchList<
    TransferRequest[],
    QueryParams
  >(getTransferHistoryAPI, debouncedQuery);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạm hiện tại
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Arrow */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạm đích
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner />
                    <span className="text-gray-500">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : transferList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Không có lịch sử chuyển pin
                </td>
              </tr>
            ) : (
              transferList.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  {/* Battery Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Battery className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transfer.battery.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transfer.battery.batteryType.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current Station */}
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transfer.currentStation.name}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs">
                          {transfer.currentStation.address}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Arrow */}
                  <td className="px-6 py-4 text-center">
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>

                  {/* New Station */}
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transfer.newStation.name}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs">
                          {transfer.newStation.address}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transfer.status)}
                  </td>

                  {/* Timestamp */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transfer.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationTable
        data={transferList}
        query={query}
        onUpdateQuery={updateQuery}
        loading={loading}
      />
    </div>
  );
}
