"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authService from "@/services/authService";
import { toast } from "react-toastify";

const ForgotPasswordPage: React.FC = () => {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await authService.forgotPassword(email);
      console.log("forgot password successfully:", res);
      toast.success(res?.message || "Hãy kiểm tra email!");
      setIsSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng nhập</span>
            </Link>

            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-3xl font-bold text-gray-900">amply</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h2>
            <p className="mt-2 text-gray-600">
              Hãy điền địa chỉ email của bạn để đặt lại mật khẩu
            </p>
          </div>

          {!isSent ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2 text-left"
                  >
                    Địa chỉ email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Nhập email của bạn"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Gửi
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-10 space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Email đã được gửi!
              </h2>
              <p className="text-gray-600">
                Hãy kiểm tra hộp thư của bạn để đặt lại mật khẩu.
              </p>

              <button
                onClick={openGmail}
                className="w-full py-3 px-4 my-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Mở Gmail
              </button>

              <p
                onClick={() => setIsSent(false)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Nhập email khác
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Xe điện đang sạc"
        />
        <div className="absolute inset-0 bg-blue-600 bg-opacity-75"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h2 className="text-4xl font-bold mb-4">Chào mừng trở lại!</h2>
            <p className="text-xl text-blue-100">
              Quản lý hệ thống trạm đổi pin xe điện một cách thông minh và hiệu
              quả
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
