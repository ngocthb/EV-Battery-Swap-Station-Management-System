"use client";

import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Plus, Shield, User, CheckCircle, XCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import useQuery from "@/hooks/useQuery";
import useFetchList from "@/hooks/useFetchList";
import { Cabinet, QueryParams, Station, StationStaff } from "@/types";
import { deleteCabinetAPI, restoreCabinetAPI } from "@/services/cabinetService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import StatsList from "./components/StatsList";
import { getAllStationList } from "@/services/stationService";
import FilterSearch from "./components/FilterSearch";
import PaginationTable from "@/components/PaginationTable";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAllStationStaffAPI } from "@/services/stationStaffService";
import CreateStaffModal from "./components/CreateStaffModal";

export default function AdminStaffPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { deleteModal, restoreModal } = useSelector(
    (state: RootState) => state.adminModal
  );

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: true,
    isHead: null,
    stationId: null,
  });
  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [
      query.page,
      query.limit,
      query.status,
      query.stationId,
      query.isHead,
      debouncedSearch,
    ]
  );

  // fetch all staff
  const {
    data: staffList = [],
    loading,
    refresh,
  } = useFetchList<StationStaff[], QueryParams>(
    getAllStationStaffAPI,
    debouncedQuery
  );

  // fetch all station
  const { data: stationList = [] } = useFetchList<Station[], QueryParams>(
    getAllStationList
  );

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
              Quản lý Nhân viên
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả nhân viên trong hệ thống
            </p>
          </div>
          <div
            onClick={() => setOpenCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nhân viên mới</span>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsList staffList={staffList} />

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={staffList.length}
            stationList={stationList}
            onSearch={handleSearch}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                isHead: null,
                status: true,
                stationId: null,
              })
            }
          />

          {/* staff Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chức vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
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
                ) : staffList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy người nào
                    </td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      {/*name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {staff?.user?.fullName}
                          </p>
                        </div>
                      </td>
                      {/*name station */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {staff?.station?.name}
                        </div>
                      </td>
                      {/*leader */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff?.isHead ? (
                          <div className="flex items-center text-green-600 font-medium">
                            <Shield className="w-4 h-4 mr-1" />
                            Trưởng trạm
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-1" />
                            Nhân viên
                          </div>
                        )}
                      </td>
                      {/*Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {staff?.status ? (
                          <span className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold w-fit">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold w-fit">
                            <XCircle className="w-3 h-3 mr-1" />
                            Ngừng hoạt động
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <PaginationTable
            data={staffList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>
      {openCreateModal && (
        <CreateStaffModal
          openCreateModal={openCreateModal}
          setOpenCreateModal={setOpenCreateModal}
        />
      )}
    </AdminLayout>
  );
}
