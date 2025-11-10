import { createReportAPI } from "@/services/reportService";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface ReportBookingModalProps {
  reportBookingId: number;
  setReportBookingId: (id: number | null) => void;
}

function ReportBookingModal({
  reportBookingId,
  setReportBookingId,
}: ReportBookingModalProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.warning("Hãy ghi lý do");
      return;
    }

    try {
      setLoading(true);
      const res = await createReportAPI({
        bookingDetailId: reportBookingId,
        description: description,
      });
      console.log("res create report", res);

      setDescription("");
      setReportBookingId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Báo cáo đơn đặt pin #{reportBookingId}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập nội dung báo cáo (ví dụ: giao sai pin, thái độ nhân viên...)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReportBookingId(null)}
              className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white transition ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(ReportBookingModal);
