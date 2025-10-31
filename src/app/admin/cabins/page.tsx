"use client";

import React, { useMemo } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Plus, Edit, Trash2, RotateCcw } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import useQuery from "@/hooks/useQuery";
import useFetchList from "@/hooks/useFetchList";
import { Cabinet, QueryParams, Station } from "@/types";
import {
  deleteCabinetAPI,
  getAllCabinetListAPI,
  restoreCabinetAPI,
} from "@/services/cabinetService";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import StatsList from "./components/StatsList";
import { getAllStationList } from "@/services/stationService";
import FilterSearch from "./components/FilterSearch";
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

export default function CabinsPage() {
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
    stationId: null,
  });
  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [
      query.page,
      query.limit,
      query.order,
      query.status,
      query.stationId,
      debouncedSearch,
    ]
  );

  // fetch all cabinet
  const {
    data: cabinList = [],
    loading,
    refresh,
  } = useFetchList<Cabinet[], QueryParams>(
    getAllCabinetListAPI,
    debouncedQuery
  );

  console.log("cabinList", cabinList);

  // fetch all station
  const { data: stationList = [] } = useFetchList<Station[], QueryParams>(
    getAllStationList
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Tủ Sạc</h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả các tủ sạc pin trong hệ thống
            </p>
          </div>
          <Link
            href="/admin/cabins/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tủ mới</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <StatsList cabinList={cabinList} />

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={cabinList.length}
            showStation={true}
            stationList={stationList}
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
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại pin
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
                ) : cabinList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy tủ nào
                    </td>
                  </tr>
                ) : (
                  cabinList.map((cabinet) => (
                    <tr key={cabinet.id} className="hover:bg-gray-50">
                      {/*name */}
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() =>
                          router.push(`/admin/cabins/${cabinet.id}`)
                        }
                      >
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {cabinet?.name}
                          </p>
                        </div>
                      </td>
                      {/*name station */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {cabinet?.station?.name}
                        </div>
                      </td>
                      {/*battery */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cabinet?.batteryTypeId}
                      </td>
                      {/*Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            cabinet?.status
                          )}`}
                        >
                          {getStatusText(cabinet?.status)}
                        </span>
                      </td>
                      {/*Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/cabins/${cabinet.id}/edit`)
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                            disabled={loading}
                            title="Chỉnh sửa trạm"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {cabinet?.status === false ? (
                            <button
                              onClick={() =>
                                dispatch(openRestoreModal(cabinet))
                              }
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Khôi phục trạm"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => dispatch(openDeleteModal(cabinet))}
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
            data={cabinList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        cabin={deleteModal.data as Cabinet | null}
        onConfirmAPI={deleteCabinetAPI}
        refreshList={refresh}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        cabinet={restoreModal.data as Cabinet | null}
        onConfirmAPI={restoreCabinetAPI}
        refreshList={refresh}
      />
    </AdminLayout>
  );
}
