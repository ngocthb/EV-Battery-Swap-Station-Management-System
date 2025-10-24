"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/layout/AdminLayout";
import {
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
} from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { Membership, QueryParams } from "@/types";
import {
  getAllMembershipList,
  deleteMembership,
  restoreMembership,
} from "@/services/membershipService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "react-toastify";
import DeleteMembershipModal from "./components/DeleteMembershipModal";

export default function MembershipsPage() {
  const router = useRouter();
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: true,
  });

  const debouncedSearch = useDebounce(query.search, 1500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.order, query.status, debouncedSearch]
  );

  // Fetch all membership
  const {
    data: membershipList = [],
    loading,
    refresh,
  } = useFetchList<Membership[], QueryParams>(
    getAllMembershipList,
    debouncedQuery
  );

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    membership: Membership | null;
    loading: boolean;
  }>({
    isOpen: false,
    membership: null,
    loading: false,
  });

  // Restore confirmation modal state
  const [restoreModal, setRestoreModal] = useState<{
    isOpen: boolean;
    membership: Membership | null;
    loading: boolean;
  }>({
    isOpen: false,
    membership: null,
    loading: false,
  });

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
        return "Tạm dừng";
      default:
        return "Không xác định";
    }
  };

  // Delete handlers
  const handleDeleteClick = (membership: Membership) => {
    setDeleteModal({
      isOpen: true,
      membership,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.membership) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await deleteMembership(deleteModal.membership.id);
      if (response.success) {
        toast.success(response.message);
        refresh();
        setDeleteModal({ isOpen: false, membership: null, loading: false });
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa gói thành viên";
      toast.error(errorMessage);
    } finally {
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, membership: null, loading: false });
  };

  // Restore handlers
  const handleRestoreClick = (membership: Membership) => {
    setRestoreModal({
      isOpen: true,
      membership,
      loading: false,
    });
  };

  const handleRestoreConfirm = async () => {
    if (!restoreModal.membership) return;

    setRestoreModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await restoreMembership(restoreModal.membership.id);
      if (response.success) {
        toast.success(response.message || "Khôi phục gói thành công!");
        refresh();
        setRestoreModal({ isOpen: false, membership: null, loading: false });
      } else {
        toast.error(response.message || "Khôi phục gói thất bại!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi khôi phục gói thành viên";
      toast.error(errorMessage);
    } finally {
      setRestoreModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleRestoreCancel = () => {
    setRestoreModal({ isOpen: false, membership: null, loading: false });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration < 30) {
      return `${duration} ngày`;
    } else if (duration < 365) {
      const months = Math.floor(duration / 30);
      return `${months} tháng`;
    } else {
      const years = Math.floor(duration / 365);
      return `${years} năm`;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Gói thành viên
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả các gói thành viên trong hệ thống
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/memberships/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm gói mới</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng gói</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(membershipList) ? membershipList.length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(membershipList)
                    ? membershipList.filter((m) => m.status === true).length
                    : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tạm dừng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(membershipList)
                    ? membershipList.filter((m) => m.status === false).length
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm gói thành viên..."
                    value={query.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="px-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
                    disabled={loading}
                  />
                  {query.search && (
                    <X
                      onClick={resetQuery}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
                    />
                  )}
                </div>

                {/* Select status */}
                <select
                  value={String(query.status)}
                  onChange={(e) => handleChangStatus(e.target.value === "true")}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value={"true"}>Hoạt động</option>
                  <option value={"false"}>Tạm dừng</option>
                </select>

                {/* Sort select */}
                <select
                  value={query.order}
                  onChange={(e) => updateQuery({ order: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="ASC">A → Z</option>
                  <option value="DESC">Z → A</option>
                </select>

                {/* Limit select */}
                <select
                  value={String(query.limit)}
                  onChange={(e) =>
                    updateQuery({ limit: Number(e.target.value), page: 1 })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value={5}>5 / trang</option>
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>
              </div>

              <p className="text-sm text-gray-600">
                Hiển thị{" "}
                {Array.isArray(membershipList) ? membershipList.length : 0} gói
                thành viên
              </p>
            </div>
          </div>

          {/* Memberships Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-2 text-gray-600">Đang tải...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin gói
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời hạn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
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
                  {Array.isArray(membershipList) &&
                  membershipList.length > 0 ? (
                    membershipList.map((membership) => (
                      <tr key={membership.id} className="hover:bg-gray-50">
                        <td
                          className="px-6 py-4 whitespace-nowrap"
                          onClick={() =>
                            router.push(`/admin/memberships/${membership.id}`)
                          }
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {membership?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {membership?.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDuration(membership?.duration || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(membership?.price || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              membership?.status
                            )}`}
                          >
                            {getStatusText(membership?.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {membership?.status === false ? (
                              <button
                                onClick={() => handleRestoreClick(membership)}
                                className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                disabled={loading}
                                title="Khôi phục gói"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeleteClick(membership)}
                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                disabled={loading}
                                title="Xóa gói"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            Không có gói thành viên
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Chưa có gói thành viên nào được tạo.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination footer */}
          <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tổng: {Array.isArray(membershipList) ? membershipList.length : 0}{" "}
              gói thành viên
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  updateQuery({ page: Math.max(1, (query.page as number) - 1) })
                }
                disabled={(query.page as number) <= 1 || loading}
                className={`px-3 py-1 rounded border flex items-center space-x-1 ${
                  (query.page as number) <= 1 || loading
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>

              <div className="px-3 py-1 border rounded bg-blue-50 text-blue-600 border-blue-200">
                Trang {query.page}
              </div>

              <button
                onClick={() =>
                  updateQuery({ page: (query.page as number) + 1 })
                }
                disabled={
                  loading ||
                  (Array.isArray(membershipList) &&
                    membershipList.length < (query.limit as number))
                }
                className={`px-3 py-1 rounded border flex items-center space-x-1 ${
                  loading ||
                  (Array.isArray(membershipList) &&
                    membershipList.length < (query.limit as number))
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteMembershipModal
          isOpen={deleteModal.isOpen}
          membership={deleteModal.membership}
          loading={deleteModal.loading}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />

        {/* Restore Confirmation Modal */}
        {restoreModal.isOpen && (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <RotateCcw className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận khôi phục gói
                  </h3>
                </div>
                <button
                  onClick={handleRestoreCancel}
                  disabled={restoreModal.loading}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Bạn có chắc chắn muốn khôi phục gói thành viên này?
                </p>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Tên gói:
                    </span>
                    <p className="text-gray-900">
                      {restoreModal.membership?.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Mô tả:
                    </span>
                    <p className="text-gray-900 text-sm">
                      {restoreModal.membership?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleRestoreCancel}
                  disabled={restoreModal.loading}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRestoreConfirm}
                  disabled={restoreModal.loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {restoreModal.loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>
                    {restoreModal.loading ? "Đang khôi phục..." : "Khôi phục"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
