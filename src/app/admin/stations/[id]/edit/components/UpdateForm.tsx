"use client";

import React, { useState, useEffect, useCallback } from "react";
import { updateStation, getStationById } from "@/services/stationService";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { geocodeAddress } from "@/utils/geocoding";
import { Station } from "@/types";

import {
  MapPin,
  FileText,
  Building,
  ArrowLeft,
  Save,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

interface FormErrors {
  name?: string;
  address?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  temperature?: string;
}

interface UpdateFormProps {
  stationId: number;
  onMapSelect?: (lat: number, lng: number) => void;
  onAddressGeocode?: (lat: number, lng: number) => void;
  mapCoords?: { lat: number; lng: number } | null;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  stationId,
  onAddressGeocode,
  mapCoords: externalMapCoords,
}) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    latitude: 0,
    longitude: 0,
    temperature: 25,
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [geocoding, setGeocoding] = useState(false);

  const debouncedAddress = useDebounce(form.address, 1000);

  // Load existing station data
  useEffect(() => {
    const loadStationData = async () => {
      try {
        setLoadingData(true);
        const response = await getStationById(stationId);

        if (response.success && response.data) {
          const station = response.data;
          setForm({
            name: station.name || "",
            description: station.description || "",
            address: station.address || "",
            latitude: station.latitude || 0,
            longitude: station.longitude || 0,
            temperature: 25,
          });
        } else {
          toast.error("Không thể tải thông tin trạm");
          router.push("/admin/stations");
        }
      } catch (err: any) {
        console.error("Error loading station:", err);
        toast.error("Không thể tải thông tin trạm");
        router.push("/admin/stations");
      } finally {
        setLoadingData(false);
      }
    };

    if (stationId) {
      loadStationData();
    }
  }, [stationId, router]);

  // Update coordinates when external map coordinates change
  useEffect(() => {
    if (externalMapCoords) {
      setForm((prev) => ({
        ...prev,
        latitude: externalMapCoords.lat,
        longitude: externalMapCoords.lng,
      }));
    }
  }, [externalMapCoords]);

  // Geocode address when it changes
  useEffect(() => {
    const performGeocode = async () => {
      if (debouncedAddress.length > 10) {
        setGeocoding(true);
        try {
          const coords = await geocodeAddress(debouncedAddress);
          if (coords && onAddressGeocode) {
            onAddressGeocode(coords.lat, coords.lng);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        } finally {
          setGeocoding(false);
        }
      }
    };

    performGeocode();
  }, [debouncedAddress, onAddressGeocode]);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên trạm là bắt buộc";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Tên trạm phải có ít nhất 3 ký tự";
    }

    if (!form.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    } else if (form.address.trim().length < 10) {
      newErrors.address = "Địa chỉ phải có ít nhất 10 ký tự";
    }

    if (!form.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (form.description.trim().length < 5) {
      newErrors.description = "Mô tả phải có ít nhất 5 ký tự";
    }

    if (form.latitude === 0 || form.longitude === 0) {
      newErrors.latitude = "Vui lòng chọn vị trí trên bản đồ";
      newErrors.longitude = "Vui lòng chọn vị trí trên bản đồ";
    }

    if (form.temperature < -10 || form.temperature > 50) {
      newErrors.temperature = "Nhiệt độ phải từ -10°C đến 50°C";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((s) => ({
      ...s,
      [name]: name === "temperature" ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateStation(stationId, {
        name: form.name.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
        temperature: form.temperature,
      });

      if (response.success) {
        toast.success(response.message);
        router.push("/admin/stations");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Cập nhật trạm thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="w-1/2 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin trạm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/admin/stations")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Cập nhật trạm sạc
            </h1>
            <p className="text-sm text-gray-600">
              Cập nhật thông tin trạm sạc trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Station Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 mr-2 text-gray-500" />
              Tên trạm sạc *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập tên trạm sạc"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
              Mô tả *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập mô tả về trạm sạc"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              Địa chỉ *
              {geocoding && (
                <span className="ml-2 text-xs text-blue-600 flex items-center">
                  <Search className="w-3 h-3 mr-1 animate-spin" />
                  Đang tìm vị trí...
                </span>
              )}
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.address ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập địa chỉ trạm sạc"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vĩ độ (Latitude) *
              </label>
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleInputChange}
                step="any"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.latitude ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.000000"
                readOnly
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                👆 Click vào bản đồ bên phải để chọn vị trí
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kinh độ (Longitude) *
              </label>
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleInputChange}
                step="any"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.longitude ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.000000"
                readOnly
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
              )}
            </div>
          </div>

          {/* Temperature */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhiệt độ hoạt động (°C) *
            </label>
            <input
              type="number"
              name="temperature"
              value={form.temperature}
              onChange={handleInputChange}
              min="-10"
              max="50"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.temperature ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="25"
            />
            {errors.temperature && (
              <p className="mt-1 text-sm text-red-600">{errors.temperature}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Nhiệt độ tối ưu cho hoạt động của trạm (từ -10°C đến 50°C)
            </p>
          </div> */}
        </div>
      </form>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/stations")}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Cập nhập trạm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
