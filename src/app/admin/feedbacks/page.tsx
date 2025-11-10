"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Edit, Eye, Plus, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import useQuery from "@/hooks/useQuery";
import { BatteryType, FeedBack, QueryParams, Station } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";
import { getAllBatteryTypeListAPI } from "@/services/batteryTypeService";
import StatsList from "./components/StatsList";
import FilterSearch from "./components/FilterSearch";
import { getAllStationList } from "@/services/stationService";
import { getFeedbackByStationIdListAPI } from "@/services/feedbackService";

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedBack[]>([]);
  const [loading, setLoading] = useState(false);
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    stationId: 1,
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.stationId, debouncedSearch]
  );

  // fetch all feedback
  const handleGetFeedbackByStation = async () => {
    setLoading(true);
    try {
      const res = await getFeedbackByStationIdListAPI(
        Number(query?.stationId),
        debouncedQuery
      );

      console.log("feedback station res", res);

      setFeedbackList(res.data);
    } catch (error) {
      console.log("feedback station err", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFeedbackByStation();
  }, [query.stationId]);

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
              Quản lý Đánh giá
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các đánh giá của các trạm
            </p>
          </div>
        </div>

        <StatsList feedbackList={feedbackList} />

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            stationList={stationList}
            resultCount={feedbackList?.length}
            onSearch={handleSearch}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                stationId: 1,
              })
            }
          />

          {/* battery type Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nội dung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm
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
                ) : feedbackList?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy đánh giá nào
                    </td>
                  </tr>
                ) : (
                  feedbackList?.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50">
                      {/*name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            ID: {feedback?.userId}
                          </p>
                        </div>
                      </td>
                      {/*name station */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {feedback?.content}
                        </div>
                      </td>
                      {/*capacity */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feedback?.rating}
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
            data={feedbackList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
