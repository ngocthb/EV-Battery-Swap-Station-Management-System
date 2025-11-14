"use client";

import React, { useMemo } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Edit, MapPin, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import useQuery from "@/hooks/useQuery";
import { BatteryType, QueryParams } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllBatteryListAPI } from "@/services/batteryService";
import useFetchList from "@/hooks/useFetchList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import PaginationTable from "@/components/PaginationTable";
import {
  deleteBatteryTypeAPI,
  getAllBatteryTypeListAPI,
  restoreBatteryTypeAPI,
} from "@/services/batteryTypeService";
import StatsList from "./components/StatsList";
import FilterSearch from "./components/FilterSearch";
import {
  openDeleteModal,
  openRestoreModal,
} from "@/store/slices/adminModalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import RestoreConfirmModal from "./components/RestoreConfirmModal";

export default function BatteryTypePage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { deleteModal, restoreModal } = useAppSelector(
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

  // fetch all pin
  const {
    data: batteryTypeList = [],
    loading,
    refresh,
  } = useFetchList<BatteryType[], QueryParams>(
    getAllBatteryTypeListAPI,
    debouncedQuery
  );

  console.log("batteryTypeList", batteryTypeList);

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
        return "Tồn tại";
      case false:
        return "Đã ẩn";
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
              Quản lý Loại Pin
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các loại pin trong hệ thống
            </p>
          </div>
          <Link
            href="/admin/battery-types/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm loại pin mới</span>
          </Link>
        </div>

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={batteryTypeList.length}
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
              })
            }
          />

          {/* battery type Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gía mỗi lần đổi
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
                ) : batteryTypeList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy loại nào
                    </td>
                  </tr>
                ) : (
                  batteryTypeList.map((batteryType) => (
                    <tr key={batteryType.id} className="hover:bg-gray-50">
                      {/*name */}
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() =>
                          router.push(`/admin/battery-types/${batteryType.id}`)
                        }
                      >
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {batteryType?.name}
                          </p>
                        </div>
                      </td>
                      {/*name station */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {batteryType?.description}
                        </div>
                      </td>
                      {/*capacity */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batteryType?.capacityKWh} KWh
                      </td>
                      {/*price */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batteryType?.pricePerSwap}
                      </td>
                      {/*Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            !!batteryType?.status
                          )}`}
                        >
                          {getStatusText(!!batteryType?.status)}
                        </span>
                      </td>
                      {/*Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/battery-types/${batteryType.id}/edit`
                              )
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                            disabled={loading}
                            title="Chỉnh sửa loại pin"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {batteryType?.status === false ? (
                            <button
                              onClick={() =>
                                dispatch(openRestoreModal(batteryType))
                              }
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Khôi phục trạm"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                dispatch(openDeleteModal(batteryType))
                              }
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
            data={batteryTypeList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        batteryType={deleteModal.data as BatteryType | null}
        onConfirmAPI={deleteBatteryTypeAPI}
        refreshList={refresh}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        batteryType={restoreModal.data as BatteryType | null}
        onConfirmAPI={restoreBatteryTypeAPI}
        refreshList={refresh}
      />
    </AdminLayout>
  );
}
