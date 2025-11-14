"use client";

import React, { memo, useState } from "react";
import { staffConfirmCashPaymentAPI } from "@/services/transactionService";
import { Loader2, XCircle, CheckCircle } from "lucide-react";
import { Transaction } from "@/types";
import { formatDateHCM } from "@/utils/format";
import { getTransactionStatusLabel } from "@/utils/formateStatus";

interface PaymentByCashModalProps {
  transactionDetail: Transaction | null;
  setTransactionDetail: (value: Transaction | null) => void;
  refresh: () => void;
}

function PaymentByCashModal({
  setTransactionDetail,
  transactionDetail,
  refresh,
}: PaymentByCashModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !transactionDetail) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await staffConfirmCashPaymentAPI({
        transactionId: transactionDetail.id,
      });
      console.log("res payment cash", res.data);
      refresh();
      setTransactionDetail(null);
    } catch (error) {
      console.error("payment cash error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Xác nhận thanh toán tiền mặt
        </h2>
        {/* Transaction Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm text-gray-700 mb-6">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">
              Phương thức thanh toán:
            </span>
            <span className="text-gray-900">
              {transactionDetail?.payment?.name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Tổng tiền (VNĐ):</span>
            <span className="font-semibold text-gray-900">
              {transactionDetail?.totalPrice}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Thời gian:</span>
            <span>{formatDateHCM(String(transactionDetail?.dateTime))}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Trạng thái:</span>
            <span
              className={`font-semibold ${
                transactionDetail.status === "SUCCESS"
                  ? "text-green-600"
                  : transactionDetail.status === "FAILED"
                  ? "text-red-600"
                  : transactionDetail.status === "PENDING"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }`}
            >
              {getTransactionStatusLabel(String(transactionDetail?.status))}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setTransactionDetail(null)}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Xác nhận
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PaymentByCashModal);
