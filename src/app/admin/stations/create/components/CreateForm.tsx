"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createStation } from "@/services/stationService";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { geocodeAddress } from "@/utils/geocoding";

import {
  MapPin,
  FileText,
  Building,
  ArrowLeft,
  Plus,
  Search,
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

interface CreateFormProps {
  onMapSelect?: (lat: number, lng: number) => void;
  onAddressGeocode?: (lat: number, lng: number) => void;
  mapCoords?: { lat: number; lng: number } | null;
}

const CreateForm: React.FC<CreateFormProps> = ({
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
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [geocoding, setGeocoding] = useState(false);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Debounce address input for geocoding
  const debouncedAddress = useDebounce(form.address, 1000);

  // Geocode address when it changes
  useEffect(() => {
    const handleGeocode = async () => {
      if (!debouncedAddress || debouncedAddress.trim().length < 10) {
        return;
      }

      setGeocoding(true);
      try {
        const result = await geocodeAddress(debouncedAddress);
        if (result) {
          setMapCoords({ lat: result.lat, lng: result.lng });
          setForm((prev) => ({
            ...prev,
            latitude: result.lat,
            longitude: result.lng,
          }));
          // Notify parent component
          if (onAddressGeocode) {
            onAddressGeocode(result.lat, result.lng);
          }
          // Clear coordinate errors if they exist
          if (errors.latitude) {
            setErrors((prev) => ({ ...prev, latitude: undefined }));
          }
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
      } finally {
        setGeocoding(false);
      }
    };

    handleGeocode();
  }, [debouncedAddress]);

  // Update form when external map coordinates change
  useEffect(() => {
    if (externalMapCoords) {
      setForm((prev) => ({
        ...prev,
        latitude: externalMapCoords.lat,
        longitude: externalMapCoords.lng,
      }));
      setMapCoords(externalMapCoords);
      // Clear coordinate errors if they exist
      if (errors.latitude) {
        setErrors((prev) => ({ ...prev, latitude: undefined }));
      }
    }
  }, [externalMapCoords]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên trạm là bắt buộc";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Tên trạm phải có ít nhất 3 ký tự";
    }

    if (!form.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    if (!form.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    } else if (form.address.trim().length < 10) {
      newErrors.address = "Địa chỉ phải có ít nhất 10 ký tự";
    }

    if (form.latitude === 0 || form.longitude === 0) {
      newErrors.latitude = "Vui lòng chọn vị trí trên bản đồ";
    }

    if (form.temperature < -50 || form.temperature > 80) {
      newErrors.temperature = "Nhiệt độ phải từ -50°C đến 80°C";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
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
      const response = await createStation({
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
        toast.error(response.message);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Tạo trạm thất bại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              Tạo trạm sạc mới
            </h1>
            <p className="text-sm text-gray-600">
              Nhập thông tin và chọn vị trí trên bản đồ
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Station Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              <span>Tên trạm sạc *</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="VD: Trạm sạc Quận 1 - Nguyễn Huệ"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>Mô tả</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về trạm sạc..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Địa chỉ *</span>
              {geocoding && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <Search className="w-3 h-3 animate-spin" />
                  <span className="text-xs">Đang tìm vị trí...</span>
                </div>
              )}
            </label>
            <div className="relative">
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.address
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } ${geocoding ? "pr-10" : ""}`}
              />
              {geocoding && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
            {(mapCoords || externalMapCoords) && form.address && (
              <p className="mt-1 text-xs text-green-600">
                ✓ Đã tìm thấy vị trí trên bản đồ
              </p>
            )}
          </div>

          {/* Coordinates */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Tọa độ *</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="latitude"
                  value={form.latitude === 0 ? "" : form.latitude.toFixed(6)}
                  readOnly
                  placeholder="Latitude"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <input
                  name="longitude"
                  value={form.longitude === 0 ? "" : form.longitude.toFixed(6)}
                  readOnly
                  placeholder="Longitude"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
            {errors.latitude && (
              <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              👆 Click vào bản đồ bên phải để chọn vị trí
            </p>
          </div>

          {/* Temperature */}
          {/* <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="w-4 h-4" />
              <span>Nhiệt độ hoạt động (°C)</span>
            </label>
            <input
              name="temperature"
              type="number"
              min="-50"
              max="80"
              value={form.temperature}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.temperature
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.temperature && (
              <p className="mt-1 text-sm text-red-600">{errors.temperature}</p>
            )}
          </div> */}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </form>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/admin/stations")}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Tạo trạm sạc</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
