"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Battery, Clock, Edit, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import useQuery from "@/hooks/useQuery";
import type { Battery as IBattery, QueryParams } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import {
  deleteBatteryAPI,
  getAllBatteryListAPI,
  restoreBatteryAPI,
} from "@/services/batteryService";
import useFetchList from "@/hooks/useFetchList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import PaginationTable from "@/components/PaginationTable";
import FilterSearch from "./components/FilterSearch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import RestoreConfirmModal from "./components/RestoreConfirmModal";
import {
  getBatteryStatusBackground,
  getBatteryStatusText,
} from "@/utils/formateStatus";
import StatsList from "./components/StatsList";
import BatteryUsedHistoryModal from "./components/BatteryUsedHistoryModal";
import TransferHistoryTab from "./components/TransferHistoryTab";

export default function BatteriesPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { deleteModal, restoreModal } = useAppSelector(
    (state: RootState) => state.adminModal
  );

  const [activeTab, setActiveTab] = useState<"list" | "history">("list");
  const [batteryHistoryId, setBatteryHistoryID] = useState<number | null>(null);

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: "AVAILABLE",
    inUse: true,
  });
  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [
      query.page,
      query.limit,
      query.order,
      query.status,
      query.inUse,
      debouncedSearch,
    ]
  );

  const handleCloseHistoryModal = useCallback(() => {
    setBatteryHistoryID(null);
  }, []);

  // fetch all pin
  const {
    data: batteryList = [],
    loading,
    refresh,
  } = useFetchList<IBattery[], QueryParams>(
    getAllBatteryListAPI,
    debouncedQuery
  );

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangeStatus = (data: string) => {
    updateQuery({ status: data });
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
          <div className="flex gap-3">
            <Link
              href="/admin/batteries/transfer"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Điều chuyển pin</span>
            </Link>
            <Link
              href="/admin/batteries/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm pin mới</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("list")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Danh sách Pin
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Lịch sử chuyển pin
            </button>
          </nav>
        </div>

        {/*Content */}
        {activeTab === "list" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Filters and Search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={batteryList.length}
              onSearch={handleSearch}
              onChangeStatus={handleChangeStatus}
              showInUse={true}
              onUpdateQuery={updateQuery}
              onReset={resetQuery}
            />

            {/* batterys Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin pin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dung lượng
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
                        {/*Modal & type */}
                        <td
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          title="Xem chi tiết"
                          onClick={() =>
                            router.push(`/admin/batteries/${battery.id}`)
                          }
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Battery className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {battery?.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {String(battery?.batteryType)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {battery?.currentCapacity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {battery?.currentCycle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBatteryStatusBackground(
                              battery?.status
                            )}`}
                          >
                            {getBatteryStatusText(battery?.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/batteries/${battery.id}/edit`
                                )
                              }
                              className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50 cursor-pointer"
                              disabled={loading}
                              title="Chỉnh sửa pin"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                setBatteryHistoryID(Number(battery?.id))
                              }
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50 cursor-pointer"
                              title="Lịch sử sử dụng"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
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
        )}

        {activeTab === "history" && <TransferHistoryTab />}
      </div>

      <DeleteConfirmModal
        battery={deleteModal.data as IBattery | null}
        onConfirmAPI={deleteBatteryAPI}
        refreshList={refresh}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        battery={restoreModal.data as IBattery | null}
        onConfirmAPI={restoreBatteryAPI}
        refreshList={refresh}
      />

      {batteryHistoryId && (
        <BatteryUsedHistoryModal
          batteryId={batteryHistoryId}
          onClose={handleCloseHistoryModal}
        />
      )}
    </AdminLayout>
  );
}
