import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { QueryParams, Transaction } from "@/types";
import { formatDateHCM } from "@/utils/format";
import {
  getTransactionStatusLabel,
  getTransactionStatusStyle,
} from "@/utils/formateStatus";
import { Calendar, CreditCard, Tag } from "lucide-react";
import { memo, useMemo } from "react";
import { getAllUserTransactionAPI } from "@/services/transactionService";

function TransactionHistory() {
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

  const { data: transactionList = [], refresh } = useFetchList<
    Transaction[],
    QueryParams
  >(getAllUserTransactionAPI, debouncedQuery);

  // status
  const total = transactionList.length;
  const completed = transactionList.filter(
    (t) => t.status === "SUCCESS"
  ).length;
  const cancelled = transactionList.filter(
    (t) => t.status === "CANCELLED"
  ).length;

  // Dùng mảng object để render
  const stats = [
    {
      label: "Giao dịch",
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
      {/* Thống kê trên cùng */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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

      {/* Lịch sử giao dịch */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Lịch sử giao dịch
        </h3>

        {/*filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3 mb-3">
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm..."
              value={query.search || ""}
              onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <select
              value={String(query.status) || ""}
              onChange={(e) => updateQuery({ status: e.target.value, page: 1 })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="SUCCESS">Thành công</option>
              <option value="PENDING">Đang xử lý</option>
              <option value="FAILED">Thất bại</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>

            <select
              value={query.order || "asc"}
              onChange={(e) => updateQuery({ order: e.target.value, page: 1 })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="asc">Sắp xếp ↑ (Cũ → Mới)</option>
              <option value="desc">Sắp xếp ↓ (Mới → Cũ)</option>
            </select>
          </div>

          {/* Nút reset cách xa */}
          <div className="flex justify-end w-full md:w-1/3">
            <button
              onClick={() => resetQuery()}
              className="border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Danh sách giao dịch */}
        <div className="space-y-4">
          {transactionList.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Không có giao dịch nào.
            </p>
          ) : (
            transactionList.map((t) => (
              <div
                key={t.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50"
              >
                <div className="flex justify-between items-stretch">
                  {/* LEFT: Info */}
                  <div className="flex-1 text-sm text-gray-600 space-y-2">
                    <p className="font-semibold text-gray-800 text-base mb-2">
                      Mã đơn hàng: {t.orderCode}
                    </p>

                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Ngày giao dịch:{" "}
                      <b className="font-medium">
                        {formatDateHCM(String(t?.dateTime))}
                      </b>
                    </p>

                    <p className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      Gói thành viên:{" "}
                      <b className="font-medium">
                        {t.userMembership?.membership?.name || "Không có"}
                      </b>
                    </p>

                    <p className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      Phương thức:{" "}
                      <b className="font-medium">
                        {t.payment?.name || "Không rõ"}
                      </b>
                    </p>

                    <p>
                      Tổng tiền:{" "}
                      <span className="font-semibold text-gray-800">
                        {Number(t.totalPrice).toLocaleString("vi-VN")} ₫
                      </span>
                    </p>
                  </div>

                  {/* RIGHT: Status + Button */}
                  <div className="flex flex-col justify-between items-end ml-6">
                    <p
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getTransactionStatusStyle(
                        t.status
                      )}`}
                    >
                      {getTransactionStatusLabel(t.status)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default memo(TransactionHistory);
