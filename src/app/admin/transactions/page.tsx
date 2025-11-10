"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import useQuery from "@/hooks/useQuery";
import { AdminLayout } from "@/layout/AdminLayout";
import { Booking, QueryParams, Transaction } from "@/types";
import { useMemo } from "react";
import FilterSearch from "./components/FilterSearch";
import StatsList from "./components/StatsList";
import { useRouter } from "next/navigation";
import { formatDateHCM } from "@/utils/format";
import { getAllTransactionAPI } from "@/services/transactionService";
import {
  getTransactionStatusLabel,
  getTransactionStatusStyle,
} from "@/utils/formateStatus";

function AdminTransactionPage() {
  const router = useRouter();
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
    data: transactionList = [],
    loading,
    refresh,
  } = useFetchList<Transaction[], QueryParams>(
    getAllTransactionAPI,
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
            resultCount={transactionList.length}
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
                            transaction?.status
                          )}`}
                        >
                          {getTransactionStatusLabel(transaction?.status)}
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
            data={transactionList}
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
