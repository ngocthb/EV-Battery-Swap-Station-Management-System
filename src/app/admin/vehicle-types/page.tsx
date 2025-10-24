"use client";

import React, { useMemo } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Edit, MapPin, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import useQuery from "@/hooks/useQuery";
import { BatteryType, QueryParams, VehicleType } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import PaginationTable from "@/components/PaginationTable";
import {
  deleteBatteryTypeAPI,
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
import {
  deleteVehicleTypeAPI,
  getAllVehicleTypeListAPI,
  restoreVehicleTypeAPI,
} from "@/services/vehicleService";

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
    data: vehicleTypeList = [],
    loading,
    refresh,
  } = useFetchList<VehicleType[], QueryParams>(
    getAllVehicleTypeListAPI,
    debouncedQuery
  );

  console.log("vehicleTypeList", vehicleTypeList);

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
              Quản lý Loại Phương tiện
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các loại phương tiện trong hệ thống
            </p>
          </div>
          <Link
            href="/admin/vehicle-types/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm loại phương tiện mới</span>
          </Link>
        </div>

        <StatsList vehicleTypeList={vehicleTypeList} />

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={vehicleTypeList.length}
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

          {/* vehicle type Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mẫu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên loại pin
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
                ) : vehicleTypeList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy loại nào
                    </td>
                  </tr>
                ) : (
                  vehicleTypeList.map((vehicleType) => (
                    <tr key={vehicleType.id} className="hover:bg-gray-50">
                      {/*name */}
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() =>
                          router.push(`/admin/vehicle-types/${vehicleType.id}`)
                        }
                      >
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {vehicleType?.model}
                          </p>
                        </div>
                      </td>
                      {/*name station */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {vehicleType?.description}
                        </div>
                      </td>
                      {/*battery type name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicleType?.batteryTypeName}
                      </td>
                      {/*Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            !!vehicleType?.status
                          )}`}
                        >
                          {getStatusText(!!vehicleType?.status)}
                        </span>
                      </td>
                      {/*Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/vehicle-types/${vehicleType.id}/edit`
                              )
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                            disabled={loading}
                            title="Chỉnh sửa loại pin"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {vehicleType?.status === false ? (
                            <button
                              onClick={() =>
                                dispatch(openRestoreModal(vehicleType))
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
                                dispatch(openDeleteModal(vehicleType))
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
            data={vehicleTypeList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        vehicleType={deleteModal.data as VehicleType | null}
        onConfirmAPI={deleteVehicleTypeAPI}
        refreshList={refresh}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        vehicleType={restoreModal.data as VehicleType | null}
        onConfirmAPI={restoreVehicleTypeAPI}
        refreshList={refresh}
      />
    </AdminLayout>
  );
}
