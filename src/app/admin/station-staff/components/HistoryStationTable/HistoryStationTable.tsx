import { CheckCircle, XCircle, Calendar } from "lucide-react";
import React from "react";
import { StationHistoryRecord } from "@/types";

interface HistoryStationTableProps {
  historyList?: StationHistoryRecord[];
  loading?: boolean;
}

export default function HistoryStationTable({
  historyList = [],
  loading = false,
}: HistoryStationTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nhân viên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạm hiện tại
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạm chuyển tới
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày chuyển
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-gray-500">Đang tải...</span>
                </div>
              </td>
            </tr>
          ) : historyList.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                Không có lịch sử chuyển trạm
              </td>
            </tr>
          ) : (
            historyList.map((history) => (
              <tr
                key={history.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Staff name and email */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {history.user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {history.user?.email}
                    </p>
                  </div>
                </td>

                {/* Current station */}
                <td className="px-6 py-4">
                  <div className="flex flex-col max-w-xs">
                    <p className="text-sm font-medium text-gray-900">
                      {history.currentStation?.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {history.currentStation?.address}
                    </p>
                  </div>
                </td>

                {/* New station */}
                <td className="px-6 py-4">
                  <div className="flex flex-col max-w-xs">
                    <p className="text-sm font-medium text-gray-900">
                      {history.newStation?.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {history.newStation?.address}
                    </p>
                  </div>
                </td>

                {/* Transfer date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(history.date)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {history.status ? (
                    <span className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold w-fit">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Thành công
                    </span>
                  ) : (
                    <span className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold w-fit">
                      <XCircle className="w-3 h-3 mr-1" />
                      Thất bại
                    </span>
                  )}
                </td>

                {/* Created date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(history.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
