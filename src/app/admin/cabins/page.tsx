"use client";

import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import {
  Zap,
  Settings,
  ChevronRight,
  Plus,
  MapPin,
  Search,
  X,
  Edit,
  Trash2,
  RotateCcw,
  ChevronLeft,
  Box,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import useQuery from "@/hooks/useQuery";
import useFetchList from "@/hooks/useFetchList";
import { Cabinet, Station } from "@/types";
import {
  deleteCabinetAPI,
  getAllCabinetListAPI,
  restoreCabinetAPI,
} from "@/services/cabinetService";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import StatsList from "./components/StatsList";
import { getAllStationList } from "@/services/stationService";
import FilterBar from "@/components/AdminFilter";
import FilterSearch from "./components/FilterSearch";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import RestoreConfirmModal from "./components/RestoreConfirmModal";

interface QueryParams {
  page: number;
  limit: number;
  search: string;
  order: string;
  status: boolean;
  stationId: number | null;
}

export default function CabinsPage() {
  const router = useRouter();
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cabinet: Cabinet | null;
    loading: boolean;
  }>({
    isOpen: false,
    cabinet: null,
    loading: false,
  });

  // Restore confirmation modal state
  const [restoreModal, setRestoreModal] = useState<{
    isOpen: boolean;
    cabinet: Cabinet | null;
    loading: boolean;
  }>({
    isOpen: false,
    cabinet: null,
    loading: false,
  });

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

  // Delete handlers
  const handleDeleteClick = (cabinet: Cabinet) => {
    setDeleteModal({
      isOpen: true,
      cabinet,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.cabinet) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await deleteCabinetAPI(deleteModal.cabinet.id);
      if (response.success) {
        toast.success(response.message);
        refresh();
        setDeleteModal({ isOpen: false, cabinet: null, loading: false });
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa tủ";
      toast.error(errorMessage);
    } finally {
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, cabinet: null, loading: false });
  };

  // Restore handlers
  const handleRestoreClick = (cabinet: Cabinet) => {
    setRestoreModal({
      isOpen: true,
      cabinet,
      loading: false,
    });
  };

  const handleRestoreConfirm = async () => {
    if (!restoreModal.cabinet) return;

    setRestoreModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await restoreCabinetAPI(restoreModal.cabinet.id);
      if (response.success) {
        toast.success(response.message || "Khôi phục tủ thành công!");
        refresh();
        setRestoreModal({ isOpen: false, cabinet: null, loading: false });
      } else {
        toast.error(response.message || "Khôi phục tủ thất bại!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi khôi phục tủ";
      toast.error(errorMessage);
    } finally {
      setRestoreModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleRestoreCancel = () => {
    setRestoreModal({ isOpen: false, cabinet: null, loading: false });
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
                    Nhiệt độ
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
                        className="px-6 py-4 whitespace-nowrap"
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
                      {/*temp */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cabinet?.temperature} độ
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
                              onClick={() => handleRestoreClick(cabinet)}
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Khôi phục trạm"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteClick(cabinet)}
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
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {Array.isArray(cabinList) ? cabinList.length : 0}
                </span>{" "}
                tủ trên trang {query.page}
              </div>
              <div className="text-sm text-gray-500">
                ({query.limit} tủ/trang)
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  updateQuery({ page: Math.max(1, query.page - 1) })
                }
                disabled={query.page <= 1 || loading}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border ${
                  query.page <= 1 || loading
                    ? "text-gray-400 bg-white border-gray-200 cursor-not-allowed"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-500"
                } transition-colors`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </button>

              <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                Trang {query.page}
              </div>

              <button
                onClick={() => updateQuery({ page: query.page + 1 })}
                disabled={
                  loading ||
                  (Array.isArray(cabinList) && cabinList.length < query.limit)
                }
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border ${
                  loading ||
                  (Array.isArray(cabinList) && cabinList.length < query.limit)
                    ? "text-gray-400 bg-white border-gray-200 cursor-not-allowed"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-500"
                } transition-colors`}
              >
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        cabin={deleteModal.cabinet}
        loading={deleteModal.loading}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        isOpen={restoreModal.isOpen}
        cabinet={restoreModal.cabinet}
        loading={restoreModal.loading}
        onConfirm={handleRestoreConfirm}
        onCancel={handleRestoreCancel}
      />
    </AdminLayout>
  );
}
