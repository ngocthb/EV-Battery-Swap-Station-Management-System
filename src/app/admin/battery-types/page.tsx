"use client";

import React, { useMemo, useState } from "react";
import FilterSearch from "../cabins/components/FilterSearch";
import { AdminLayout } from "@/layout/AdminLayout";
import { Plus, Trash2, Edit3 } from "lucide-react";
import TypesTable from "./components/TypesTable";
import TypeFormModal from "./components/TypeFormModal";

type BatteryType = {
  id: string;
  name: string;
  description?: string;
};

export default function BatteryTypesPage() {
  const [types, setTypes] = useState<BatteryType[]>([
    { id: "1", name: "Li-ion 48V", description: "48V lithium-ion battery" },
    { id: "2", name: "Lead-Acid 24V", description: "24V lead-acid pack" },
  ]);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
    status: true,
    stationId: null,
  });

  const filtered = useMemo(() => {
    let list = types.slice();
    if (query.search) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(query.search.toLowerCase())
      );
    }
    // ordering
    list.sort((a, b) =>
      query.order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    return list;
  }, [types, query.search, query.order]);

  const paged = useMemo(() => {
    const start = (query.page - 1) * query.limit;
    return filtered.slice(start, start + query.limit);
  }, [filtered, query.page, query.limit]);

  const [editing, setEditing] = useState<BatteryType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (t: BatteryType) => {
    setEditing(t);
    setIsOpen(true);
  };

  const handleSave = (payload: { name: string; description?: string }) => {
    if (editing) {
      setTypes((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p))
      );
    } else {
      const id = String(Date.now());
      setTypes((prev) => [{ id, ...payload }, ...prev]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Xóa loại pin này?")) return;
    setTypes((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Quản lý loại pin</h1>
            <p className="text-sm text-gray-600">
              Tạo, sửa và xoá các loại pin có trong hệ thống
            </p>
          </div>

          <div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Thêm loại pin
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <FilterSearch
            query={query}
            loading={false}
            resultCount={filtered.length}
            showStatus={false}
            showOrder={true}
            onSearch={(val: string) =>
              setQuery((q) => ({ ...q, search: val, page: 1 }))
            }
            onChangeStatus={() => {}}
            onUpdateQuery={(n) => setQuery((q) => ({ ...q, ...(n as any) }))}
            onReset={() =>
              setQuery({
                page: 1,
                limit: 10,
                search: "",
                order: "asc",
                status: true,
                stationId: null,
              })
            }
          />

          <TypesTable items={paged} onEdit={openEdit} onDelete={handleDelete} />

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{paged.length}</span> /{" "}
              {filtered.length} loại
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) }))
                }
                disabled={query.page <= 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border"
              >
                Prev
              </button>
              <div className="text-sm">Trang {query.page}</div>
              <button
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                disabled={query.page * query.limit >= filtered.length}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <TypeFormModal
          open={isOpen}
          initial={editing}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
}
