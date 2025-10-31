import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { getUserBookingListAPI } from "@/services/bookingService";
import { QueryParams } from "@/types";
import { formatDateHCM } from "@/utils/format";
import { getBookingStatusLabel } from "@/utils/formateStatus";
import {
  Battery,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { memo, useMemo } from "react";

interface Booking {
  id: number;
  status: string;
  expectedPickupTime: string;
  createdAt: string;
  userVehicle: {
    id: number;
    name: string;
  };
  bookingDetails: {
    id: number;
    batteryId: number;
    price: string;
    status: string;
  }[];
}

function BookingHistory() {
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    month: 0,
    year: 0,
  });
  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.page, query.limit, query.month, query.year, debouncedSearch]
  );

  const { data: bookingList = [], refresh } = useFetchList<
    Booking[],
    QueryParams
  >(getUserBookingListAPI, debouncedQuery);

  const renderStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" /> Hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <XCircle className="w-4 h-4" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý
          </span>
        );
    }
  };

  // status
  const total = bookingList.length;
  const completed = bookingList.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookingList.filter((b) => b.status === "CANCELLED").length;

  // Dùng mảng object để render
  const stats = [
    {
      label: "Đặt lịch",
      value: total,
      color: "blue",
      bars: ["bg-blue-300 h-6", "bg-blue-400 h-8", "bg-blue-200 h-4"],
    },
    {
      label: "Hoàn thành",
      value: completed,
      color: "green",
      bars: ["bg-green-200 h-3", "bg-green-300 h-7", "bg-green-100 h-5"],
    },
    {
      label: "Đã hủy",
      value: cancelled,
      color: "orange",
      bars: ["bg-orange-200 h-4", "bg-orange-300 h-5", "bg-orange-400 h-6"],
    },
  ];

  return (
    <>
      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <div className="text-sm text-gray-500">{s.label}</div>
              <div className={`text-2xl font-semibold text-${s.color}-600`}>
                {s.value}
              </div>
            </div>
            <div className="w-16 h-10 bg-gray-50 rounded flex items-end">
              {s.bars.map((bar, j) => (
                <div key={j} className={`w-2 rounded ml-1 ${bar}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/*Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Lịch sử đặt lịch
        </h3>

        {/*filter */}
        <div className=" flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3 mb-3">
          {/* Ô tìm kiếm */}
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm phương tiện..."
              value={query.search || ""}
              onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Chọn tháng/năm */}
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <input
              type="month"
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                updateQuery({
                  month: Number(month),
                  year: Number(year),
                  page: 1,
                });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Nút reset */}
          <div className="flex items-center justify-end w-full md:w-auto">
            <button
              onClick={() => resetQuery()}
              className="border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/*list */}
        <div className="space-y-4">
          {bookingList.map((b) => {
            const totalPrice = b.bookingDetails.reduce(
              (sum, d) => sum + parseFloat(d.price),
              0
            );

            return (
              <div
                key={b.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-800">
                    {b.userVehicle?.name || "Không rõ phương tiện"}
                  </p>
                  {getBookingStatusLabel(b.status)}
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Ngày đặt:{" "}
                    <b className="font-medium">{formatDateHCM(b.createdAt)}</b>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Giờ nhận dự kiến:{" "}
                    <b className="font-medium">
                      {formatDateHCM(b.expectedPickupTime)}
                    </b>
                  </p>

                  <p className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-gray-500" />
                    Số pin:{" "}
                    <b className="font-medium">{b.bookingDetails.length}</b> |
                    Tổng tiền:{" "}
                    <span className="font-semibold text-gray-800">
                      {totalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default memo(BookingHistory);
