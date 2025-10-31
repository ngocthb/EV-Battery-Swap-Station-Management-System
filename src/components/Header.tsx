"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  History,
  LogOut,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const { logout } = useAuth();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-8">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 ml-2">amply</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Tính năng
            </Link>
            <Link
              href="#dashboard"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Bảng điều khiển
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Giới thiệu
            </Link>

            <Link
              href="#contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* User Section */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex items-center space-x-3 focus:outline-none cursor-pointer"
                  >
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {user?.role?.toLowerCase() || "user"}
                      </p>
                    </div>
                    {user?.avatar ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden">
                        <Image
                          src={user?.avatar || ""}
                          alt={user?.fullName || "Avatar"}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium uppercase">
                        {user?.fullName?.charAt(0) || (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44 mt-2">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/booking"
                      className="flex items-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Đặt lịch</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/history"
                      className="flex items-center space-x-2"
                    >
                      <History className="w-4 h-4" />
                      <span>Lịch sử</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/login"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký</span>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 space-y-4 z-50">
            <Link
              href="/"
              className="block text-gray-600 hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="#features"
              className="block text-gray-600 hover:text-blue-600 transition-colors"
            >
              Tính năng
            </Link>
            <Link
              href="#dashboard"
              className="block text-gray-600 hover:text-blue-600 transition-colors"
            >
              Bảng điều khiển
            </Link>
            <Link
              href="#about"
              className="block text-gray-600 hover:text-blue-600 transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              href="#contact"
              className="block text-gray-600 hover:text-blue-600 transition-colors"
            >
              Liên hệ
            </Link>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Hồ sơ
                  </Link>
                  <Link
                    href="/booking"
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Đặt lịch
                  </Link>
                  <Link
                    href="/history"
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Lịch sử
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors w-full"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Đăng nhập</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Đăng ký</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
