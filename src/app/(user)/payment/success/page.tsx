import { Suspense } from "react";
import PaymentSuccessPage from "../PaymentSuccessPage";

export const dynamic = "force-dynamic";

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessPage />
    </Suspense>
  );
}
