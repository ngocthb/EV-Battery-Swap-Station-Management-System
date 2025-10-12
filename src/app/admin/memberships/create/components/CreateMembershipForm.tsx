"use client";

import React, { useState } from "react";
import { createMembership } from "@/services/membershipService";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ArrowLeft,
  Save,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

interface FormErrors {
  name?: string;
  description?: string;
  duration?: string;
  price?: string;
}

const CreateMembershipForm: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên gói thành viên là bắt buộc";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Tên gói phải có ít nhất 2 ký tự";
    }

    if (!form.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    if (form.duration <= 0) {
      newErrors.duration = "Thời hạn phải lớn hơn 0";
    }

    if (form.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    } else if (form.price > 100000000) {
      newErrors.price = "Giá không được vượt quá 100.000.000 VND";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "price" ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleStatusChange = (status: boolean) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await createMembership({
        name: form.name.trim(),
        description: form.description.trim(),
        duration: form.duration,
        price: form.price,
      });

      if (response.success) {
        toast.success(response.message || "Tạo gói thành công!");
        router.push("/admin/memberships");
      } else {
        setError(response.message || "Tạo gói thất bại");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Tạo gói thành viên thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration < 30) {
      return `${duration} ngày`;
    } else if (duration < 365) {
      const months = Math.floor(duration / 30);
      return `${months} tháng`;
    } else {
      const years = Math.floor(duration / 365);
      return `${years} năm`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/admin/memberships")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Tạo gói thành viên mới
            </h1>
            <p className="text-sm text-gray-500">
              Thêm gói thành viên mới vào hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Thông tin cơ bản
              </h3>

              {/* Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên gói thành viên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nhập tên gói thành viên"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mô tả *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nhập mô tả chi tiết về gói thành viên"
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Duration & Price */}
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Thời hạn & Giá
              </h3>

              {/* Duration */}
              <div className="mb-4">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Thời hạn (ngày) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.duration ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nhập số ngày"
                  disabled={loading}
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Hiển thị: {formatDuration(form.duration || 0)}
                </p>
              </div>

              {/* Price */}
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Giá (VND) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    min="0"
                    max="100000000"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Nhập giá gói"
                    disabled={loading}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Hiển thị: {formatPrice(form.price || 0)} VND
                </p>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-lg border p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Xem trước gói
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên:</span>
                    <span className="font-medium">
                      {form.name || "Chưa nhập"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời hạn:</span>
                    <span className="font-medium">
                      {formatDuration(form.duration || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(form.price || 0)} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/admin/memberships")}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <Save className="w-4 h-4" />
            <span>{loading ? "Đang tạo..." : "Tạo gói"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMembershipForm;
