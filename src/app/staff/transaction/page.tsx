"use client";

import { StaffLayout } from "@/layout/StaffLayout";
import { Crown, Plus, Search, UserCheck, Users, UserX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QueryParams, Transaction, User } from "@/types";
import useQuery from "@/hooks/useQuery";
import useFetchList from "@/hooks/useFetchList";
import { getAllUserListAPI } from "@/services/userService";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllTransactionByStation } from "@/services/transactionService";
import FilterSearch from "./components/FilterSearch";
import PaymentByCashModal from "./components/PaymentByCashModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getTransactionStatusLabel } from "@/utils/formateStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatDateHCM } from "@/utils/format";

export default function StaffManageUser() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [transactionDetail, setTransactionDetail] =
    useState<Transaction | null>(null);

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: "",
    stationId: 0,
  });

  useEffect(() => {
    if (user?.stationId) {
      updateQuery({ stationId: user.stationId });
    }
  }, [user?.stationId]);

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [
      query.page,
      query.limit,
      query.order,
      query.status,
      query.stationId,
      debouncedSearch,
    ]
  );

  const { data: transactionList = [], loading } = useFetchList<
    Transaction[],
    QueryParams
  >(getAllTransactionByStation, debouncedQuery);

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách giao dịch của trạm
            </h1>
            <p className="text-gray-600 mt-1">Danh sách tất cả giao dịch</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={transactionList.length}
            onSearch={handleSearch}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                order: "asc",
                status: "",
                stationId: user?.stationId,
              })
            }
          />

          {/* transaction Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức thanh toán
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
                ) : transactionList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy đơn nào
                    </td>
                  </tr>
                ) : (
                  transactionList.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      {/*phương thức thanh toán */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction?.payment?.name}
                      </td>
                      {/*price */}
                      <td className="px-6 py-4">{transaction?.totalPrice}</td>
                      {/*date time*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateHCM(String(transaction?.dateTime))}
                      </td>
                      {/*status */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold w-fit
                              ${
                                transaction?.status === "SUCCESS"
                                  ? "bg-green-100 text-green-800"
                                  : transaction?.status === "FAILED"
                                  ? "bg-red-100 text-red-800"
                                  : transaction?.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                        >
                          {getTransactionStatusLabel(transaction?.status)}
                        </span>
                      </td>

                      {/* Pay by Cash */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => setTransactionDetail(transaction)}
                          disabled={transaction?.status !== "PENDING"}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1
                                ${
                                  transaction?.status === "PENDING"
                                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                          💵 Thanh toán tiền mặt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {transactionDetail && (
        <PaymentByCashModal
          transactionDetail={transactionDetail}
          setTransactionDetail={setTransactionDetail}
        />
      )}
    </StaffLayout>
  );
}
