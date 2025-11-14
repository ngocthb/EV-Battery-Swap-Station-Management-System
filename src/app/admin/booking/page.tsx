"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { AdminLayout } from "@/layout/AdminLayout";
import { getAllBookingListAPI } from "@/services/bookingService";
import { getAllStationList } from "@/services/stationService";
import { Booking, QueryParams, Station } from "@/types";
import { useMemo, useState, useEffect } from "react";

import FilterSearch from "./components/FilterSearch";
import StatsList from "./components/StatsList";
import { useRouter } from "next/navigation";
import { formatDateHCM } from "@/utils/format";
import {
  getBookingStatusLabel,
  getBookingStatusStyle,
} from "@/utils/formateStatus";
import { Eye, X } from "lucide-react";

function AdminBookingPage() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    stationId: undefined,
  });
  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.status, query.stationId, debouncedSearch]
  );

  // fetch all booking
  const {
    data: bookingList = [],
    loading,
    refresh,
  } = useFetchList<Booking[], QueryParams>(
    getAllBookingListAPI,
    debouncedQuery
  );

  // client-side filter by stationId (some API returns booking.station as number)
  const filteredBookings = useMemo(() => {
    if (!query.stationId) return bookingList;
    const sid = Number(query.stationId);
    return bookingList.filter((b: any) => {
      // booking.station may be number or bookingDetails[0].station?.id
      const stationField =
        (b as any).station ??
        b?.bookingDetails?.[0]?.station ??
        b?.bookingDetails?.[0]?.station?.id;
      return Number(stationField) === sid;
    });
  }, [bookingList, query.stationId]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const openBookingModal = (b: Booking) => {
    setSelectedBooking(b);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setSelectedBooking(null);
    setShowBookingModal(false);
  };

  const fetchStations = async () => {
    try {
      const resp = await getAllStationList({});
      const data = resp.data || [];
      setStations(data);
    } catch (err: unknown) {
      console.error("Lỗi khi lấy danh sách trạm:", err);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

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
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Đặt lịch
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các đơn đặt lịch trong hệ thống
            </p>
          </div>
        </div>

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            stations={stations}
            resultCount={bookingList.length}
            onSearch={handleSearch}
            onChangeStatus={handleChangeStatus}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                status: "",
                stationId: undefined,
              })
            }
          />

          {/* battery type Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên người đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xe người đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pin ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền (VND)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian đặt lịch
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                        <span className="text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : bookingList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy đơn nào
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      {/*user name */}
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900">
                            {booking?.user?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking?.user?.username}
                          </p>
                        </div>
                      </td>
                      {/*user vehicle */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {booking?.userVehicle?.name}
                        </div>
                      </td>
                      {/*Pin id */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking?.bookingDetails?.[0]?.batteryId}
                      </td>
                      {/*price */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking?.bookingDetails?.[0]?.price ||
                          "Không có dữ liệu"}
                      </td>
                      {/*Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getBookingStatusStyle(
                            String(booking?.status)
                          )}`}
                        >
                          {getBookingStatusLabel(String(booking?.status))}
                        </span>
                      </td>

                      {/*created at */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateHCM(String(booking?.createdAt)) ||
                          "Không có dữ liệu"}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          type="button"
                          onClick={() => openBookingModal(booking)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <PaginationTable
            data={filteredBookings}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>
      {/* Booking detail modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Chi tiết đặt lịch #{selectedBooking.id}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getBookingStatusStyle(
                    String(selectedBooking.status)
                  )}`}
                >
                  {getBookingStatusLabel(String(selectedBooking.status))}
                </span>
              </div>
              <button
                onClick={closeBookingModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* User Info */}
                <div className="flex-row bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div>
                    <p className="text-xs font-medium text-blue-600 uppercase mb-2">
                      Thông tin người đặt
                    </p>
                    <div className="flex-row">
                      <p className="text-sm text-gray-900 font-medium">
                        {selectedBooking.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Phương tiện
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedBooking.userVehicle?.name || "Không có dữ liệu"}
                    </p>
                  </div>
                </div>
                {/* Station */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Trạm
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {(() => {
                      const sid = Number(
                        selectedBooking.station ?? selectedBooking.station
                      );
                      return (
                        stations.find((s) => s.id === sid)?.name ||
                        `Trạm #${sid}`
                      );
                    })()}
                  </p>
                </div>

                {/* Vehicle */}

                {/* Created At */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Thời gian tạo
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDateHCM(String(selectedBooking.createdAt)) ||
                      "Không có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Battery Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Chi tiết pin ({selectedBooking.bookingDetails?.length || 0})
                  </h4>
                </div>
                <div className="flex flex-row flex-wrap gap-4 p-4">
                  {selectedBooking.bookingDetails?.map((detail, idx) => (
                    <div
                      key={detail.id}
                      className="border  border-blue-100 p-4 rounded-lg w-48 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium">
                          Pin ID: {detail.batteryId}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        Giá:{" "}
                        <span className="font-semibold">
                          {detail.price
                            ? `${Number(detail.price).toLocaleString()} VND`
                            : "Miễn phí"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Info */}
              {selectedBooking.transaction && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Tổng tiền:</span>
                      <span className="text-lg font-bold text-green-900">
                        {selectedBooking.transaction.totalPrice
                          ? `${Number(
                              selectedBooking.transaction.totalPrice
                            ).toLocaleString()} VND`
                          : "Không có dữ liệu"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">
                        Phương thức:
                      </span>
                      <span className="text-sm font-medium text-green-900">
                        {selectedBooking.transaction.payment?.name ||
                          "Không có dữ liệu"}
                      </span>
                    </div>
                    {selectedBooking.transaction.status && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">
                          Trạng thái thanh toán:
                        </span>
                        <span className="text-sm font-medium text-green-900">
                          {selectedBooking.transaction.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminBookingPage;
