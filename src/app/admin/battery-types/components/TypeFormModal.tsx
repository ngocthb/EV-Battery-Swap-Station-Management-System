"use client";

import React, { useEffect, useState } from "react";

type BatteryType = {
  id: string;
  name: string;
  description?: string;
};

export default function TypeFormModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: BatteryType | null;
  onClose: () => void;
  onSave: (payload: { name: string; description?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow max-w-md w-full p-6">
        <h3 className="text-lg font-medium mb-4">
          {initial ? "Sửa loại pin" : "Thêm loại pin"}
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Tên</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Hủy
          </button>
          <button
            onClick={() => {
              if (!name.trim()) {
                alert("Vui lòng nhập tên");
                return;
              }
              onSave({
                name: name.trim(),
                description: description.trim() || undefined,
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
