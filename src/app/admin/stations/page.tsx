"use client";

import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/layout/AdminLayout";
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  X,
} from "lucide-react";
import useQuery from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchList from "@/hooks/useFetchList";
import { Station } from "@/types";
import { getAllStationList } from "@/services/stationService";

// Mock data cho stations
const mockStations = [
  {
    id: 1,
    name: "Trạm Quận 1",
    code: "ST-001",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    cabins: 8,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Trạm Quận 3",
    code: "ST-002",
    address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    cabins: 6,
    status: "maintenance",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Trạm Quận 7",
    code: "ST-003",
    address: "789 Nguyễn Thị Thập, Quận 7, TP.HCM",
    cabins: 12,
    status: "offline",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "Trạm Thủ Đức",
    code: "ST-004",
    address: "321 Võ Văn Ngân, Thủ Đức, TP.HCM",
    cabins: 10,
    status: "active",
    createdAt: "2024-04-05",
  },
  {
    id: 5,
    name: "Trạm Bình Thạnh",
    code: "ST-005",
    address: "654 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    cabins: 4,
    status: "active",
    createdAt: "2024-05-12",
  },
];

interface QueryParams {
  page: number;
  limit: number;
  search: string;
  order: string;
  status: boolean;
}

export default function StationsPage() {
  const { query, updateQuery, resetQuery } = useQuery<QueryParams>({
    page: 1,
    limit: 100,
    search: "",
    order: "asc",
    status: true,
  });

  const debouncedSearch = useDebounce(query.search, 1500);
  const debouncedQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [query.status, debouncedSearch]
  );

  // fetch all station
  const { data: stationList = [], loading } = useFetchList<
    Station[],
    QueryParams
  >(getAllStationList, debouncedQuery);

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
        return "Đóng cửa";
      default:
        return "Không xác định";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Trạm sạc
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả các trạm sạc pin trong hệ thống
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Thêm trạm mới</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng trạm</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockStations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockStations.filter((s) => s.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bảo trì</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    mockStations.filter((s) => s.status === "maintenance")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockStations.filter((s) => s.status === "offline").length}
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
                {/*Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm trạm..."
                    value={query.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="px-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
                  />
                  {query.search && (
                    <X
                      onClick={resetQuery}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
                    />
                  )}
                </div>

                {/*select status */}
                <select
                  value={String(query.status)}
                  onChange={(e) => handleChangStatus(e.target.value === "true")}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={"true"}>Hoạt động</option>
                  <option value={"false"}>Đóng cửa</option>
                </select>
              </div>

              <p className="text-sm text-gray-600">
                Hiển thị {stationList.length} trạm
              </p>
            </div>
          </div>

          {/* Stations Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin trạm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cabin
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
                {stationList.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {station?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {station?.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {station?.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station?.batteryCount} batteryCount
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          station?.status
                        )}`}
                      >
                        {getStatusText(station?.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
