"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/layout/AdminLayout";
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { Station } from "@/types";
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

interface QueryParams {
  page: number;
  limit: number;
  search: string;
  order: string;
  status: boolean;
}

export default function StationsPage() {
  const router = useRouter();
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: true,
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    station: Station | null;
    loading: boolean;
  }>({
    isOpen: false,
    station: null,
    loading: false,
  });

  // Restore confirmation modal state
  const [restoreModal, setRestoreModal] = useState<{
    isOpen: boolean;
    station: Station | null;
    loading: boolean;
  }>({
    isOpen: false,
    station: null,
    loading: false,
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
  console.log(stationList);
  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangStatus = (data: boolean) => {
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
  const handleDeleteClick = (station: Station) => {
    setDeleteModal({
      isOpen: true,
      station,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.station) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await deleteStation(deleteModal.station.id);
      if (response.success) {
        toast.success(response.message);
        refresh();
        setDeleteModal({ isOpen: false, station: null, loading: false });
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa trạm";
      toast.error(errorMessage);
    } finally {
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, station: null, loading: false });
  };

  // Restore handlers
  const handleRestoreClick = (station: Station) => {
    setRestoreModal({
      isOpen: true,
      station,
      loading: false,
    });
  };

  const handleRestoreConfirm = async () => {
    if (!restoreModal.station) return;

    setRestoreModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await restoreStation(restoreModal.station.id);
      if (response.success) {
        toast.success(response.message || "Khôi phục trạm thành công!");
        refresh();
        setRestoreModal({ isOpen: false, station: null, loading: false });
      } else {
        toast.error(response.message || "Khôi phục trạm thất bại!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi khôi phục trạm";
      toast.error(errorMessage);
    } finally {
      setRestoreModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleRestoreCancel = () => {
    setRestoreModal({ isOpen: false, station: null, loading: false });
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng trạm</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stationList?.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stationList?.filter((s) => s.status === true).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stationList.filter((s) => s.status === false).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên trạm..."
                    value={query.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {query.search && !loading && (
                    <button
                      onClick={() => updateQuery({ search: "", page: 1 })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {/* Status filter */}
                  <select
                    value={String(query.status)}
                    onChange={(e) =>
                      handleChangStatus(e.target.value === "true")
                    }
                    disabled={loading}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 min-w-[120px]"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Đóng cửa</option>
                  </select>

                  {/* Sort order */}
                  <select
                    value={query.order}
                    onChange={(e) => updateQuery({ order: e.target.value })}
                    disabled={loading}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 min-w-[120px]"
                  >
                    <option value="ASC">A → Z</option>
                    <option value="DESC">Z → A</option>
                  </select>

                  {/* Items per page */}
                  <select
                    value={String(query.limit)}
                    onChange={(e) =>
                      updateQuery({ limit: Number(e.target.value), page: 1 })
                    }
                    disabled={loading}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 min-w-[100px]"
                  >
                    <option value={5}>5/trang</option>
                    <option value={10}>10/trang</option>
                    <option value={20}>20/trang</option>
                    <option value={50}>50/trang</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Đang tải...</span>
                    </span>
                  ) : (
                    `Tìm thấy ${stationList.length} trạm`
                  )}
                </p>
                {(query.search || !query.status) && !loading && (
                  <button
                    onClick={() =>
                      updateQuery({ search: "", status: true, page: 1 })
                    }
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
          </div>

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
                        className="px-6 py-4 whitespace-nowrap"
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
                            <div className="text-sm text-gray-500">
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
                        {station?.temperature} °C
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
                              onClick={() => handleRestoreClick(station)}
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Khôi phục trạm"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteClick(station)}
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
                  {Array.isArray(stationList) ? stationList.length : 0}
                </span>{" "}
                trạm trên trang {query.page}
              </div>
              <div className="text-sm text-gray-500">
                ({query.limit} trạm/trang)
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
                  (Array.isArray(stationList) &&
                    stationList.length < query.limit)
                }
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border ${
                  loading ||
                  (Array.isArray(stationList) &&
                    stationList.length < query.limit)
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
        station={deleteModal.station}
        loading={deleteModal.loading}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        isOpen={restoreModal.isOpen}
        station={restoreModal.station}
        loading={restoreModal.loading}
        onConfirm={handleRestoreConfirm}
        onCancel={handleRestoreCancel}
      />
    </AdminLayout>
  );
}
