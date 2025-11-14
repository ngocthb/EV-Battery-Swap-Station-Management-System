"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/layout/AdminLayout";
import { MapPin, Search, Plus, Edit, Trash2, X, RotateCcw } from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { QueryParams, Station } from "@/types";
import {
  getAllStationList,
  deleteStation,
  restoreStation,
} from "@/services/stationService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Link from "next/link";
import { toast } from "react-toastify";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import RestoreConfirmModal from "./components/RestoreConfirmModal";
import PaginationTable from "@/components/PaginationTable";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import {
  openDeleteModal,
  openRestoreModal,
} from "@/store/slices/adminModalSlice";
import FilterSearch from "./components/FilterSearch";
import Image from "next/image";

export default function StationsPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { deleteModal, restoreModal } = useSelector(
    (state: RootState) => state.adminModal
  );

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: true,
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.order, query.status, debouncedSearch]
  );

  // fetch all station
  const {
    data: stationList = [],
    loading,
    refresh,
  } = useFetchList<Station[], QueryParams>(getAllStationList, debouncedQuery);

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangeStatus = (data: boolean) => {
    updateQuery({ status: data });
  };

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800";
      case false:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: boolean) => {
    switch (status) {
      case true:
        return "Hoạt động";
      case false:
        return "Đóng cửa";
      default:
        return "Không xác định";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Trạm sạc
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả các trạm sạc pin trong hệ thống
            </p>
          </div>
          <Link
            href="/admin/stations/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm trạm mới</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={stationList.length}
            onSearch={handleSearch}
            onChangeStatus={handleChangeStatus}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                order: "asc",
                status: true,
                stationId: 0,
              })
            }
          />

          {/* Stations Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin trạm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
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
                ) : stationList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy trạm nào
                    </td>
                  </tr>
                ) : (
                  stationList.map((station) => (
                    <tr key={station.id} className="hover:bg-gray-50">
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer overflow-hidden"
                        title="Xem chi tiết"
                        onClick={() =>
                          router.push(`/admin/stations/${station.id}`)
                        }
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {station?.name}
                            </div>
                            <div className="text-sm text-gray-500 w-[150px]">
                              {station?.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {station?.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <img src={station?.image} className="w-10 h-10" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            station?.status
                          )}`}
                        >
                          {getStatusText(station?.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/stations/${station.id}/edit`)
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                            disabled={loading}
                            title="Chỉnh sửa trạm"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {station?.status === false ? (
                            <button
                              // onClick={() => handleRestoreClick(station)}
                              onClick={() =>
                                dispatch(openRestoreModal(station))
                              }
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Khôi phục trạm"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => dispatch(openDeleteModal(station))}
                              className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Xóa trạm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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
            data={stationList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        station={deleteModal.data as Station | null}
        onConfirmAPI={deleteStation}
        refreshList={refresh}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        station={restoreModal.data as Station | null}
        onConfirmAPI={restoreStation}
        refreshList={refresh}
      />
    </AdminLayout>
  );
}
