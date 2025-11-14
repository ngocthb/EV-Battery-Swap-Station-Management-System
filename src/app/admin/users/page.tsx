"use client";

import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  UserCheck,
  UserX,
  Crown,
  Eye,
} from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { QueryParams, User } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { getAllUserListAPI } from "@/services/userService";
import { getUserStatusColor, getUserStatusText } from "@/utils/formateStatus";
import StatsList from "./components/StatsList";
import FilterSearch from "./components/FilterSearch";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationTable from "@/components/PaginationTable";

export default function UsersPage() {
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: "",
    role: "USER",
  });

  const debouncedSearch = useDebounce(query.search, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [
      query.page,
      query.limit,
      query.order,
      query.status,
      query.role,
      debouncedSearch,
    ]
  );

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleChangeStatus = (data: string) => {
    updateQuery({ status: data });
  };

  const { data: userList = [], loading } = useFetchList<User[], QueryParams>(
    getAllUserListAPI,
    debouncedQuery
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Người dùng
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={userList.length}
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
                role: "USER",
              })
            }
          />

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ và Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                        <span className="text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : userList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  userList.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
                            {user?.avatar ? (
                              <img
                                src={user?.avatar}
                                alt={user?.username || "User Avatar"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-medium text-sm">
                                {user?.username?.charAt(0).toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">{user.fullName}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusColor(
                            user?.status
                          )}`}
                        >
                          {getUserStatusText(user?.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <PaginationTable
            data={userList}
            query={query}
            onUpdateQuery={updateQuery}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
