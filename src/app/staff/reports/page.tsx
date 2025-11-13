"use client";

import React, { useEffect, useState } from "react";
import { StaffLayout } from "@/layout/StaffLayout";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { Check, X, User } from "lucide-react";

type ReportItem = {
  id: number;
  bookingDetailId: number;
  userId: number;
  description: string;
  faultyBatteryId?: number;
  status: string;
  createdAt: string;
  bookingDetail?: any;
  user?: { id: number; username: string; fullName: string; email: string };
};

export default function StaffReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "CONFIRMED" | "REJECTED"
  >("ALL");

  const stationId = 1; // TODO: derive from staff context

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (statusFilter && statusFilter !== "ALL") params.status = statusFilter;

      const resp = await api.get(`/report/station/${stationId}`, { params });
      const data = resp.data?.data || [];
      setReports(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lấy báo cáo thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, statusFilter]);

  const updateReportStatus = async (id: number, newStatus: string) => {
    try {
      if (newStatus === "CONFIRMED") {
        await api.patch(`/report/confirm/${id}`);
      } else if (newStatus === "REJECTED") {
        await api.patch(`/report/reject/${id}`);
      } else {
        await api.patch(`/report/${id}`, { status: newStatus });
      }

      toast.success(`Cập nhật thành công`);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cập nhật thất bại";
      toast.error(msg);
    }
  };

  return (
    <StaffLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Báo cáo trạm</h1>
            <p className="text-sm text-gray-600">
              Danh sách các báo cáo từ người dùng tại trạm của bạn
            </p>
          </div>
        </div>

        {/* Wrapper with white background for filters + table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          {/* Filters */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo nội dung hoặc người báo cáo..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-80 pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="REJECTED">REJECTED</option>
              </select>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value={5}>5/trang</option>
                <option value={10}>10/trang</option>
                <option value={20}>20/trang</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Tổng: <span className="font-medium">{reports.length}</span>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setLimit(10);
                  setPage(1);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người báo cáo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
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
                        Đang tải...
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không có báo cáo
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {r.user?.fullName ||
                                  r.user?.username ||
                                  `User ${r.userId}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {r.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {r.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            Booking detail: {r.bookingDetailId}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              r.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : r.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : r.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const disabled = "PENDING" !== r.status;
                              return (
                                <>
                                  <button
                                    disabled={disabled}
                                    onClick={() =>
                                      updateReportStatus(r.id, "CONFIRMED")
                                    }
                                    className={`text-green-600 p-1 ${
                                      disabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:text-green-900"
                                    }`}
                                    title="Confirm"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    disabled={disabled}
                                    onClick={() =>
                                      updateReportStatus(r.id, "REJECTED")
                                    }
                                    className={`text-red-600 p-1 ${
                                      disabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:text-red-900"
                                    }`}
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{reports.length}</span>{" "}
                báo cáo
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border"
                >
                  Prev
                </button>
                <div className="text-sm">Trang {page}</div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={reports.length < limit}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
