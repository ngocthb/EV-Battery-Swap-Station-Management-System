"use client";

import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import useQuery from "@/hooks/useQuery";
import { QueryParams, Report, Station } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";
import StatsList from "./components/StatsList";
import FilterSearch from "./components/FilterSearch";
import { getAllStationList } from "@/services/stationService";
import { getAllReportByStationAPI } from "@/services/reportService";

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    stationId: 1,
    status: "PENDING",
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.stationId, debouncedSearch]
  );

  // get all report by station
  const { data: reportList = [] } = useFetchList<Report[], QueryParams>(
    getAllReportByStationAPI,
    debouncedQuery
  );

  // fetch all station
  const { data: stationList = [] } = useFetchList<Station[]>(getAllStationList);

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Báo cáo
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các báo cáo của các trạm
            </p>
          </div>
        </div>

        <StatsList reportList={reportList} />

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            stationList={stationList}
            resultCount={reportList?.length}
            onSearch={handleSearch}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                stationId: 1,
                status: "PENDING",
              })
            }
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pin lỗi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                        <span className="text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : reportList?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy đánh giá nào
                    </td>
                  </tr>
                ) : (
                  reportList?.map((report) => (
                    <tr key={report?.id} className="hover:bg-gray-50">
                      {/*name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {report?.user?.email}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report?.user?.username}
                          </p>
                        </div>
                      </td>
                      {/*pin */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {report?.faultyBatteryId}
                        </div>
                      </td>
                      {/*booking */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report?.bookingDetail?.bookingId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {report?.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {report?.status}
                        </div>
                      </td>
                      {/*Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                            disabled={loading}
                            title="Chỉnh sửa loại pin"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <PaginationTable
            data={reportList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
