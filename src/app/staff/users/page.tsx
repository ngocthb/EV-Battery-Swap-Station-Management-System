"use client";

import { StaffLayout } from "@/layout/StaffLayout";
import { Crown, Plus, Search, UserCheck, Users, UserX } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import FilterSearch from "./component/FilterSearch";
import { QueryParams, User } from "@/types";
import useQuery from "@/hooks/useQuery";
import useFetchList from "@/hooks/useFetchList";
import { getAllUserListAPI } from "@/services/userService";
import { useDebounce } from "@/hooks/useDebounce";
import AddVehicleModal from "./component/AddVehicleModal";
import UserDetailModal from "./component/UserDetailModal";

export default function StaffManageUser() {
  const [showModalCreateVehicle, setShowModalCreateVehicle] = useState<
    boolean | null
  >(null);

  const [showUserDetailModal, setShowUserDetailModal] = useState<number | null>(
    null
  );

  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: "VERIFIED",
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
      query.stationId,
      debouncedSearch,
    ]
  );

  const { data: userList = [], loading } = useFetchList<User[], QueryParams>(
    getAllUserListAPI,
    debouncedQuery
  );

  const handleSearch = (data: string) => {
    updateQuery({ search: data });
  };

  const handleCloseAddVehicleModal = useCallback(() => {
    setShowModalCreateVehicle(false);
  }, []);

  const handleCloseUserDetailModal = useCallback(() => {
    setShowUserDetailModal(null);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "USER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "staff":
        return "Staff";
      case "USER":
        return "Khách hàng";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800";
      case "PENDING_VERIFICATION":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "Đã xác thực";
      case "PENDING_VERIFICATION":
        return "Chờ xác thực";
      default:
        return "Chưa kích hoạt";
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách Người dùng
            </h1>
            <p className="text-gray-600 mt-1">
              Danh sách tất cả người dùng trong hệ thống
            </p>
          </div>
          <button
            onClick={() => setShowModalCreateVehicle(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phương tiện cho người dùng</span>
          </button>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng người dùng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUsers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUsers.filter((u) => u.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    mockUsers.filter((u) => u.membershipType === "premium")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Không hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUsers.filter((u) => u.status === "inactive").length}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={userList.length}
            onSearch={handleSearch}
            onUpdateQuery={updateQuery}
            onReset={() =>
              updateQuery({
                page: 1,
                limit: 10,
                search: "",
                order: "asc",
                status: "VERIFIED",
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
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userList.length > 0 ? (
                  userList.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          onClick={() => setShowUserDetailModal(user.id)}
                          className="cursor-pointer"
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {user?.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.toString().padStart(3, "0")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                            user?.role
                          )}`}
                        >
                          {getRoleText(user?.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            user?.status
                          )}`}
                        >
                          {getStatusText(user?.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-gray-500 italic"
                    >
                      Không có người dùng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModalCreateVehicle && (
        <AddVehicleModal onClose={handleCloseAddVehicleModal} />
      )}

      {showUserDetailModal && (
        <UserDetailModal
          onClose={handleCloseUserDetailModal}
          userId={showUserDetailModal}
        />
      )}
    </StaffLayout>
  );
}
