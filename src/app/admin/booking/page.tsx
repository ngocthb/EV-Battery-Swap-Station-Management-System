"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { AdminLayout } from "@/layout/AdminLayout";
import { getAllBookingListAPI } from "@/services/bookingService";
import { Booking, QueryParams } from "@/types";
import { useCallback, useMemo, useState } from "react";
// import FilterSearch from "./components/FilterSearch";
// import StatsList from "./components/StatsList";
import { useRouter } from "next/navigation";
import { formatDateHCM } from "@/utils/format";
import {
  getBookingStatusLabel,
  getBookingStatusStyle,
} from "@/utils/formateStatus";
import { Clock } from "lucide-react";
import BatteryUsedHistoryModal from "./components/BatteryUsedHistoryModal";

function AdminBookingPage() {
  const router = useRouter();
  const [bookingId, setBookingId] = useState<number | null>(null);

  const handleCloseHistoryModal = useCallback(() => {
    setBookingId(null);
  }, []);
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: "",
  });
  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.order, query.status, debouncedSearch]
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

        {/* <StatsList bookingList={bookingList} /> */}

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          {/* <FilterSearch
            query={query}
            loading={loading}
            resultCount={bookingList.length}
            onSearch={handleSearch}
            onChangeStatus={handleChangeStatus}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                order: "asc",
                status: "",
              })
            }
          /> */}

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
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                        <span className="text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : bookingList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy đơn nào
                    </td>
                  </tr>
                ) : (
                  bookingList.map((booking) => (
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
                        {booking?.bookingDetails[0]?.batteryId}-
                        {booking?.bookingDetails[1]?.batteryId}
                      </td>
                      {/*price */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking?.bookingDetails[0]?.price ||
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setBookingId(Number(booking?.id))}
                          className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50 cursor-pointer"
                          title="Lịch sử sử dụng"
                        >
                          <Clock className="w-4 h-4" />
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
            data={bookingList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>

      {bookingId && (
        <BatteryUsedHistoryModal
          bookingId={bookingId}
          onClose={handleCloseHistoryModal}
        />
      )}
    </AdminLayout>
  );
}

export default AdminBookingPage;
