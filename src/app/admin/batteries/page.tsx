"use client";

import React, { useMemo } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Edit, MapPin, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import useQuery from "@/hooks/useQuery";
import { Battery, QueryParams } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllBatteryListAPI } from "@/services/batteryService";
import useFetchList from "@/hooks/useFetchList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import PaginationTable from "@/components/PaginationTable";

export default function BatteriesPage() {
  const router = useRouter();

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: "AVAILABLE",
  });
  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.order, query.status, debouncedSearch]
  );

  // fetch all pin
  const {
    data: batteryList = [],
    loading,
    refresh,
  } = useFetchList<Battery[], QueryParams>(
    getAllBatteryListAPI,
    debouncedQuery
  );

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangStatus = (data: boolean) => {
    updateQuery({ status: data });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Hoạt động";
      case "MAINTENANCE":
        return "Bảo trì";
      case "CHARGING":
        return "Đang sạc";
      case "IN_USE":
        return "Đang được sử dụng";
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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Pin</h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả các pin trong hệ thống
            </p>
          </div>
          <Link
            href="/admin/batteries/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm pin mới</span>
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
                  {batteryList?.length}
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
                  {batteryList?.filter((s) => s.status === "AVAILABLE").length}
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
                <p className="text-sm font-medium text-gray-600">Bảo trì</p>
                <p className="text-2xl font-bold text-gray-900">
                  {batteryList.filter((s) => s.status === "MAINTENANCE").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*Content */}
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
                    placeholder="Tìm kiếm theo tên pin..."
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
                {/*Filter */}
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
                    <option value="AVAILABLE">Hoạt động</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                    <option value="CHARGING">Đang sạc</option>
                    <option value="IN_USE">Được sử dụng</option>
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
              {/*filter result */}
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Đang tải...</span>
                    </span>
                  ) : (
                    `Tìm thấy ${batteryList.length} pin`
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

          {/* batterys Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin pin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gía
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vòng đời
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
                ) : batteryList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy pin nào
                    </td>
                  </tr>
                ) : (
                  batteryList.map((battery) => (
                    <tr key={battery.id} className="hover:bg-gray-50">
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() =>
                          router.push(`/admin/batteries/${battery.id}`)
                        }
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {battery?.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {battery?.batteryType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {battery?.capacity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {battery?.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {battery?.cycleLife}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            battery?.status
                          )}`}
                        >
                          {getStatusText(battery?.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/batteries/${battery.id}/edit`)
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                            disabled={loading}
                            title="Chỉnh sửa pin"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {battery?.status === "MAINTENANCE" ? (
                            <button
                              // onClick={() => handleRestoreClick(battery)}
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Khôi phục pin"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              // onClick={() => handleDeleteClick(battery)}
                              className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                              disabled={loading}
                              title="Xóa pin"
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

          <PaginationTable
            data={batteryList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
