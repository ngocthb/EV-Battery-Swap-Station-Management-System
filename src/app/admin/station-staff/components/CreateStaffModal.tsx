"use client";

import { memo, useState } from "react";
import { X } from "lucide-react";
import { createStationStaffAPI } from "@/services/stationStaffService";
import { toast } from "react-toastify";

interface CreateStaffModalProps {
  openCreateModal: boolean;
  setOpenCreateModal: (value: boolean) => void;
  refresh: () => void;
}
function CreateStaffModal({
  openCreateModal,
  setOpenCreateModal,
  refresh,
}: CreateStaffModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Vui lòng chọn file!");

    console.log("file", file);
    const formData = new FormData();
    console.log("form data append", formData.append);
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await createStationStaffAPI(formData);
      console.log("res create staff", res.data);
      toast.success("Tải lên thành công!");
      refresh();
      setOpenCreateModal(false);
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Tải lên thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!openCreateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tải lên danh sách nhân viên</h2>
          <button onClick={() => setOpenCreateModal(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border p-2 rounded w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? "Đang tải..." : "Tải lên"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default memo(CreateStaffModal);
