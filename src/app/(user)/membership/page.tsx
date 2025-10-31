"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Membership, MembershipResponse } from "@/types/index";
import { getPublicMemberships } from "@/services/membershipService";

import { toast } from "react-toastify";
import MembershipCard from "./components/MembershipCard";
import { UserLayout } from "@/layout/UserLayout";

const MembershipList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  const params = useMemo(() => ({ page, limit }), [page, limit]);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: MembershipResponse = await getPublicMemberships(params);

      if (response.success) {
        setMemberships(response.data);
      } else {
        throw new Error(response.message || "Không thể tải danh sách gói");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Đã xảy ra lỗi";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [page, limit]);

  const handleSelectMembership = async (id: number) => {
    setSelectedId(id);
    setSubscribing(true);

    try {
      // TODO: Implement subscription logic here
      // await subscribeMembership(id);
      toast.success("Đăng ký gói thành công!");
      fetchMemberships();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng ký gói thất bại";
      toast.error(errorMessage);
    } finally {
      setSelectedId(null);
      setSubscribing(false);
    }
  };

  if (loading && memberships.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600">Đang tải gói thành viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-600">{error}</p>
          <button
            onClick={fetchMemberships}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Chọn gói thành viên phù hợp
            </h1>
            <p className="text-xl text-gray-600">
              Đổi pin dễ dàng, tiện lợi với các gói thành viên đa dạng
            </p>
          </div>

          {/* Membership Cards Grid */}
          {memberships.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">Không có gói thành viên nào.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {memberships.map((membership) => (
                <MembershipCard
                  key={membership.id}
                  membership={membership}
                  onSelect={handleSelectMembership}
                  isLoading={subscribing && selectedId === membership.id}
                  isSelected={selectedId === membership.id}
                />
              ))}
            </div>
          )}

          {/* Additional Info Section */}
          <div className="mt-16 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Tại sao chọn chúng tôi?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Nhanh chóng
                </h3>
                <p className="text-sm text-gray-600">
                  Đổi pin chỉ trong vài phút tại các trạm của chúng tôi
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">An toàn</h3>
                <p className="text-sm text-gray-600">
                  Pin chất lượng cao, được kiểm tra kỹ lưỡng
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Nhiều địa điểm
                </h3>
                <p className="text-sm text-gray-600">
                  Mạng lưới trạm đổi pin rộng khắp thành phố
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default MembershipList;
