import { Battery, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

function BookingHeader() {
  return (
    <header className="bg-white shadow-sm relative">
      <div className=" mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Battery className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EVSwap</span>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href={"/login"}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              href={"/register"}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng ký</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default BookingHeader;
