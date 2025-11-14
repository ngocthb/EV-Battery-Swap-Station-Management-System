"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { AdminLayout } from "@/layout/AdminLayout";
import { Booking, QueryParams, Transaction } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import FilterSearch from "./components/FilterSearch";
import StatsList from "./components/StatsList";
import { useRouter } from "next/navigation";
import { formatDateHCM } from "@/utils/format";
import { getAllTransactionAPI } from "@/services/transactionService";
import {
  getTransactionStatusLabel,
  getTransactionStatusStyle,
} from "@/utils/formateStatus";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

function AdminTransactionPage() {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [realtimeTransactions, setRealtimeTransactions] = useState<
    Transaction[]
  >([]);

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

  // fetch all transactions
  const {
    data: transactionList = [],
    loading,
    refresh,
  } = useFetchList<Transaction[], QueryParams>(
    getAllTransactionAPI,
    debouncedQuery
  );

  // Socket connection and listeners
  useEffect(() => {
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL || "https://amply.io.vn/api/v1/";
    const socketURL = baseURL.replace("/api/v1/", "");

    const socket = io(`${socketURL}/transaction`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to /transaction namespace:", socket.id);
    });

    socket.on(
      "payment_confirmed",
      (data: {
        transactionId: number;
        bookingId?: number;
        userMembershipId?: number;
        status: string;
        totalPrice: number;
      }) => {
        console.log("🔔 Payment confirmed:", data);
        toast.success(
          `Thanh toán thành công: ${
            data.bookingId
              ? `Booking #${data.bookingId}`
              : `Membership #${data.userMembershipId}`
          } - ${data.totalPrice.toLocaleString("vi-VN")} VND`
        );

        // Update or add transaction to real-time list
        const txId = String(data.transactionId);
        const txStatus = data.status as
          | "SUCCESS"
          | "PENDING"
          | "FAILED"
          | "CANCELLED";

        setRealtimeTransactions((prev) => {
          const exists = prev.find((tx) => tx.id === txId);
          if (exists) {
            return prev.map((tx) =>
              tx.id === txId
                ? {
                    ...tx,
                    status: txStatus,
                    totalPrice: String(data.totalPrice),
                  }
                : tx
            );
          }
          // New transaction - just refresh to get full data
          return prev;
        });

        // Refresh full list to get complete transaction data
        refresh();
      }
    );

    socket.on(
      "payment_failed",
      (data: { transactionId: number; reason: string }) => {
        toast.error(
          `Thanh toán thất bại: Transaction #${data.transactionId} - ${data.reason}`
        );

        const txId = String(data.transactionId);

        // Update status to FAILED
        setRealtimeTransactions((prev) =>
          prev.map((tx) =>
            tx.id === txId ? { ...tx, status: "FAILED" as const } : tx
          )
        );

        refresh();
      }
    );

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from /transaction namespace");
    });

    return () => {
      socket.disconnect();
    };
  }, [refresh]);

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangeStatus = (data: string) => {
    updateQuery({ status: data });
  };

  // Filter transactions by type (client-side)
  const filteredTransactions = useMemo(() => {
    if (!query.status) return transactionList;

    return transactionList.filter((transaction) => {
      if (query.status === "MEMBERSHIP") {
        return transaction.userMembership != null;
      } else if (query.status === "BOOKING") {
        return transaction.booking != null;
      }
      return true;
    });
  }, [transactionList, query.status]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý giao dịch
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các giao dịch trong hệ thống
            </p>
          </div>
        </div>

        <StatsList transactionList={transactionList} />

        {/*Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters and Search */}
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={filteredTransactions.length}
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
          />

          {/* battery type Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại giao dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền(VND)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                        <span className="text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy đơn nào
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      {/*phương thức thanh toán */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction?.payment?.name}
                      </td>
                      {/*loại giao dịch */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction?.userMembership ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Mua gói thành viên
                          </span>
                        ) : transaction?.booking ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Thanh toán booking
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      {/*price */}
                      <td className="px-6 py-4">
                        {Number(transaction?.totalPrice)?.toLocaleString(
                          "vi-VN"
                        )}
                      </td>
                      {/*date time*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateHCM(String(transaction?.dateTime))}
                      </td>
                      {/* status */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionStatusStyle(
                            String(transaction?.status)
                          )}`}
                        >
                          {getTransactionStatusLabel(
                            String(transaction?.status)
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <PaginationTable
            data={filteredTransactions}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminTransactionPage;
