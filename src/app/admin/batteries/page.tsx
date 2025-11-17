"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import { Battery, Clock, Edit, Plus, RotateCcw } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
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
import WarehousePanel from "./components/WarehousePanel";
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

  const [activeTab, setActiveTab] = useState<"list" | "history" | "warehouse">(
    "list"
  );
  const [batteryHistoryId, setBatteryHistoryID] = useState<number | null>(null);
  const [warehouseRequests, setWarehouseRequests] = useState<any[]>([]);
  const [warehouseBatteries, setWarehouseBatteries] = useState<any[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [selectedBatteryId, setSelectedBatteryId] = useState<number[]>([]);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveRequestId, setApproveRequestId] = useState<number | null>(null);
  const [approveNote, setApproveNote] = useState<string>("");
  const [submittingApprove, setSubmittingApprove] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState<string>("");
  const [submittingReject, setSubmittingReject] = useState(false);

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

  // Fetch warehouse data when tab is active
  useEffect(() => {
    if (activeTab === "warehouse") {
      fetchWarehouseData();
    }
  }, [activeTab]);

  const fetchWarehouseData = async () => {
    setWarehouseLoading(true);
    try {
      const [requestsRes, batteriesRes] = await Promise.all([
        api.get("/request", { params: { page: 1, limit: 10 } }),
        api.get("/battery/warehouse", { params: { page: 1, limit: 10 } }),
      ]);
      setWarehouseRequests(requestsRes.data.data || []);
      setWarehouseBatteries(batteriesRes.data.data || []);
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
    } finally {
      setWarehouseLoading(false);
    }
  };

  const openApproveModal = (requestId: number) => {
    if (!selectedBatteryId || selectedBatteryId.length === 0) {
      toast.warning("Vui lòng chọn pin trong kho trước khi duyệt yêu cầu");
      return;
    }
    // Validate selected battery types match the request's batteryType
    const req = warehouseRequests.find((r) => r.id === requestId);
    if (req && req.batteryType && req.batteryType.id) {
      const mismatched = selectedBatteryId.some((id) => {
        const b = warehouseBatteries.find((bb) => bb.id === id);
        return !b || b.batteryType?.id !== req.batteryType?.id;
      });
      if (mismatched) {
        toast.warning("Các pin đã chọn phải cùng loại với yêu cầu");
        return;
      }
    }

    setApproveRequestId(requestId);
    setApproveModalOpen(true);
  };

  const openRejectModal = (requestId: number) => {
    setRejectRequestId(requestId);
    setRejectNote("");
    setRejectModalOpen(true);
  };

  const submitApproveRequest = async () => {
    if (!approveRequestId) return;
    if (!selectedBatteryId || selectedBatteryId.length === 0) {
      toast.warning("Vui lòng chọn pin để gán cho yêu cầu");
      return;
    }

    // Re-validate types before submitting
    const req = warehouseRequests.find((r) => r.id === approveRequestId);
    if (req && req.batteryType && req.batteryType.id) {
      const mismatched = selectedBatteryId.some((id) => {
        const b = warehouseBatteries.find((bb) => bb.id === id);
        return !b || b.batteryType?.id !== req.batteryType?.id;
      });
      if (mismatched) {
        toast.warning("Các pin đã chọn phải cùng loại với yêu cầu");
        return;
      }
    }
    setSubmittingApprove(true);
    try {
      await api.patch(`/request/${approveRequestId}/accept`, {
        batteryIds: selectedBatteryId,
      });
      toast.success("Đã duyệt yêu cầu");
      setApproveModalOpen(false);
      setApproveRequestId(null);
      setApproveNote("");
      setSelectedBatteryId([]);
      await fetchWarehouseData();
    } catch (error) {
      console.error("Approve request error:", error);
      toast.error("Không thể duyệt yêu cầu. Vui lòng thử lại.");
    } finally {
      setSubmittingApprove(false);
    }
  };

  const handleRejectRequest = async (requestId: number, note?: string) => {
    if (!note || note.trim() === "") {
      toast.warning("Lý do từ chối là bắt buộc");
      return;
    }
    try {
      setWarehouseLoading(true);
      await api.patch(`/request/${requestId}/reject`, { note });
      toast.success("Đã từ chối yêu cầu");
      await fetchWarehouseData();
    } catch (error) {
      console.error("Reject request error:", error);
      toast.error("Không thể từ chối yêu cầu. Vui lòng thử lại.");
    } finally {
      setWarehouseLoading(false);
    }
  };

  const submitRejectFromModal = async () => {
    if (!rejectRequestId) return;
    if (!rejectNote || rejectNote.trim() === "") {
      toast.warning("Lý do từ chối là bắt buộc");
      return;
    }
    setSubmittingReject(true);
    try {
      await handleRejectRequest(rejectRequestId, rejectNote.trim());
      setRejectModalOpen(false);
      setRejectRequestId(null);
      setRejectNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReject(false);
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
          <div className="flex gap-3">
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
              onClick={() => setActiveTab("warehouse")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "warehouse"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Kho
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

        {activeTab === "warehouse" && (
          <WarehousePanel
            requests={warehouseRequests}
            batteries={warehouseBatteries}
            loading={warehouseLoading}
            onApproveRequest={openApproveModal}
            onRejectRequest={openRejectModal}
            onSelectBattery={(ids) => setSelectedBatteryId(ids)}
            selectedBatteryIds={selectedBatteryId}
          />
        )}
      </div>

      <DeleteConfirmModal
        battery={deleteModal.data as IBattery | null}
        onConfirmAPI={deleteBatteryAPI}
        refreshList={refresh}
      />

      {approveModalOpen &&
        (() => {
          const currentRequest = warehouseRequests.find(
            (r) => r.id === approveRequestId
          );
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-40" />
              <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-lg mx-4">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Xác nhận duyệt yêu cầu
                  </h3>
                  <button
                    onClick={() => setApproveModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Đóng
                  </button>
                </div>
                <div className="p-4">
                  {currentRequest && (
                    <div className="mb-3 text-sm text-gray-600">
                      <div>Trạm: {currentRequest.station?.name || "-"}</div>
                      <div>
                        Loại pin: {currentRequest.batteryType?.name || "-"}
                      </div>
                      <div>Yêu cầu: {currentRequest.requestedQuantity}</div>
                    </div>
                  )}

                  <div className="max-h-48 overflow-y-auto">
                    {warehouseBatteries &&
                    selectedBatteryId &&
                    selectedBatteryId.length > 0 ? (
                      selectedBatteryId.map((battId) => {
                        const batt = warehouseBatteries.find(
                          (b) => b.id === battId
                        );
                        if (!batt) {
                          return (
                            <div
                              key={battId}
                              className="p-3 text-sm text-gray-500"
                            >
                              Pin #{battId} không còn tồn tại trong kho
                            </div>
                          );
                        }
                        return (
                          <div
                            key={batt.id}
                            className="py-2 flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Battery className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {batt.model}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {batt.batteryType?.name || "N/A"} •{" "}
                                  {batt.currentCapacity}%
                                </div>
                              </div>
                            </div>
                            <div>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  batt.status === "AVAILABLE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {batt.status === "AVAILABLE"
                                  ? "Sẵn sàng"
                                  : batt.status}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-sm text-gray-500">
                        Chưa có pin được chọn
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setApproveModalOpen(false)}
                      className="px-4 py-2 rounded bg-gray-100 text-gray-700"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={submitApproveRequest}
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      disabled={submittingApprove}
                    >
                      {submittingApprove ? "Đang xử lý..." : "Xác nhận duyệt"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {rejectModalOpen &&
        (() => {
          const currentRequest = warehouseRequests.find(
            (r) => r.id === rejectRequestId
          );
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-40" />
              <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-md mx-4">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Xác nhận từ chối yêu cầu
                  </h3>
                  <button
                    onClick={() => setRejectModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Đóng
                  </button>
                </div>
                <div className="p-4">
                  {currentRequest && (
                    <div className="mb-3 text-sm text-gray-600">
                      <div>Trạm: {currentRequest.station?.name || "-"}</div>
                      <div>
                        Loại pin: {currentRequest.batteryType?.name || "-"}
                      </div>
                      <div>Yêu cầu: {currentRequest.requestedQuantity}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-700">
                      Lý do từ chối
                    </label>
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      className="w-full mt-1 border rounded px-2 py-1 text-sm"
                      rows={4}
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setRejectModalOpen(false)}
                      className="px-4 py-2 rounded bg-gray-100 text-gray-700"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={submitRejectFromModal}
                      className="px-4 py-2 rounded bg-red-600 text-white"
                      disabled={submittingReject}
                    >
                      {submittingReject ? "Đang xử lý..." : "Xác nhận từ chối"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
