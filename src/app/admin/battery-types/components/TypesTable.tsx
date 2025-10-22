"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";

type BatteryType = {
  id: string;
  name: string;
  description?: string;
};

export default function TypesTable({
  items,
  onEdit,
  onDelete,
}: {
  items: BatteryType[];
  onEdit: (t: BatteryType) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mô tả
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((it) => (
            <tr key={it.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {it.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {it.name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {it.id}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {it.description || "-"}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(it)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Chỉnh sửa loại pin"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(it.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Xóa loại pin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
