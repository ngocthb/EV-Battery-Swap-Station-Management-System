"use client";

import React, { useState, useEffect } from "react";
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
  Upload,
  Clock,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import ClockTimePicker from "@/components/ClockTimePicker";

interface FormErrors {
  name?: string;
  address?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  temperature?: string;
  image?: string;
  openTime?: string;
  closeTime?: string;
}

interface CreateFormProps {
  onMapSelect?: (lat: number, lng: number) => void;
  onAddressGeocode?: (lat: number, lng: number) => void;
  mapCoords?: { lat: number; lng: number } | null;
  initialAddress?: string;
}

const CreateForm: React.FC<CreateFormProps> = ({
  onAddressGeocode,
  mapCoords: externalMapCoords,
  initialAddress,
}) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    image: "",
    openTime: "06:00:00",
    closeTime: "22:00:00",
    latitude: 0,
    longitude: 0,
    temperature: 25,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [geocoding, setGeocoding] = useState(false);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);
  const openPickerRef = React.useRef<HTMLDivElement | null>(null);
  const closePickerRef = React.useRef<HTMLDivElement | null>(null);

  const debouncedAddress = useDebounce(form.address, 1000);

  // Update address from map selection
  useEffect(() => {
    if (initialAddress && initialAddress !== form.address) {
      setForm((prev) => ({ ...prev, address: initialAddress }));
    }
  }, [initialAddress]);

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
          if (onAddressGeocode) {
            onAddressGeocode(result.lat, result.lng);
          }
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

  // Close pickers when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        showOpenPicker &&
        openPickerRef.current &&
        !openPickerRef.current.contains(target)
      ) {
        setShowOpenPicker(false);
      }
      if (
        showClosePicker &&
        closePickerRef.current &&
        !closePickerRef.current.contains(target)
      ) {
        setShowClosePicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showOpenPicker, showClosePicker]);

  // Prevent background page scrolling when picker is open
  useEffect(() => {
    const anyOpen = showOpenPicker || showClosePicker;
    const previous = document.body.style.overflow;
    if (anyOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previous || "";
    }

    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [showOpenPicker, showClosePicker]);

  // Update form when external map coordinates change
  useEffect(() => {
    if (externalMapCoords) {
      setForm((prev) => ({
        ...prev,
        latitude: externalMapCoords.lat,
        longitude: externalMapCoords.lng,
      }));
      setMapCoords(externalMapCoords);
      if (errors.latitude) {
        setErrors((prev) => ({ ...prev, latitude: undefined }));
      }
    }
  }, [externalMapCoords]);

  // Select image locally; upload will happen on save
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // create preview locally
    const blobUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setImagePreview(blobUrl);
    // clear previously uploaded image URL (if any)
    setForm((prev) => ({ ...prev, image: "" }));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };
  const handleRemoveImage = () => {
    // revoke blob url if created
    try {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    } catch (e) {
      // ignore
    }
    setSelectedFile(null);
    setForm((prev) => ({ ...prev, image: "" }));
    setImagePreview("");
  };

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

    if (!form.image && !selectedFile) {
      newErrors.image = "Vui lòng upload ảnh trạm";
    }

    if (!form.openTime) {
      newErrors.openTime = "Vui lòng nhập giờ mở cửa";
    }

    if (!form.closeTime) {
      newErrors.closeTime = "Vui lòng nhập giờ đóng cửa";
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (form.openTime && !timeRegex.test(form.openTime)) {
      newErrors.openTime = "Định dạng giờ không hợp lệ (HH:MM:SS)";
    }
    if (form.closeTime && !timeRegex.test(form.closeTime)) {
      newErrors.closeTime = "Định dạng giờ không hợp lệ (HH:MM:SS)";
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

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let imageToSend = form.image;

      // Upload image if there's a selected file
      if (selectedFile) {
        setUploading(true);
        try {
          console.log("Starting image upload...");
          let uploadedUrl: string;

          try {
            uploadedUrl = await uploadFileToCloudinary(selectedFile);
            console.log("Upload successful:", uploadedUrl);
          } catch (firstErr) {
            console.warn("First upload attempt failed, retrying...", firstErr);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            uploadedUrl = await uploadFileToCloudinary(selectedFile);
            console.log("Retry upload successful:", uploadedUrl);
          }

          imageToSend = uploadedUrl;
          setForm((prev) => ({ ...prev, image: uploadedUrl }));

          // Clean up local file
          setSelectedFile(null);
          if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
          }
          setImagePreview(uploadedUrl);
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          toast.error(
            `Upload ảnh thất bại: ${
              uploadErr instanceof Error
                ? uploadErr.message
                : "Lỗi không xác định"
            }`
          );
          return;
        } finally {
          setUploading(false);
        }
      }

      console.log("Creating station with data:", {
        name: form.name.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        image: imageToSend,
        openTime: form.openTime,
        closeTime: form.closeTime,
        latitude: form.latitude,
        longitude: form.longitude,
        temperature: form.temperature,
      });

      const response = await createStation({
        name: form.name.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        image: imageToSend,
        openTime: form.openTime,
        closeTime: form.closeTime,
        latitude: form.latitude,
        longitude: form.longitude,
        temperature: form.temperature,
      });

      console.log("Create station response:", response);

      if (response.success) {
        toast.success(response.message || "Tạo trạm thành công!");
        router.push("/admin/stations");
      } else {
        toast.error(response.message || "Tạo trạm thất bại!");
      }
    } catch (err: unknown) {
      console.error("Submit error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Tạo trạm thất bại";
      setError(errorMessage);
      toast.error(errorMessage);
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
              <span>Mô tả *</span>
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

          {/* Image Upload */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>Hình ảnh trạm *</span>
            </label>
            {imagePreview ? (
              <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  errors.image ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  )}
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">
                      {uploading ? "Đang upload..." : "Click để upload"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG tối đa 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Opening Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div ref={openPickerRef} className="relative">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>Giờ mở cửa *</span>
              </label>
              <div className="relative">
                <input
                  name="openTime"
                  type="text"
                  readOnly
                  value={form.openTime.slice(0, 8)}
                  onClick={() => setShowOpenPicker(true)}
                  className={`w-full px-4 py-3 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.openTime
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {showOpenPicker && (
                  <div className="absolute z-50 mt-2 left-0">
                    <ClockTimePicker
                      value={form.openTime}
                      onChange={(t: string) => {
                        setForm((prev) => ({ ...prev, openTime: t }));
                        setShowOpenPicker(false);
                        if (errors.openTime)
                          setErrors((p) => ({ ...p, openTime: undefined }));
                      }}
                      onClose={() => setShowOpenPicker(false)}
                    />
                  </div>
                )}
              </div>
              {errors.openTime && (
                <p className="mt-1 text-sm text-red-600">{errors.openTime}</p>
              )}
            </div>
            <div ref={closePickerRef} className="relative">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>Giờ đóng cửa *</span>
              </label>
              <div className="relative">
                <input
                  name="closeTime"
                  type="text"
                  readOnly
                  value={form.closeTime.slice(0, 8)}
                  onClick={() => setShowClosePicker(true)}
                  className={`w-full px-4 py-3 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.closeTime
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {showClosePicker && (
                  <div className="absolute z-50 mt-2 left-0">
                    <ClockTimePicker
                      value={form.closeTime}
                      onChange={(t: string) => {
                        setForm((prev) => ({ ...prev, closeTime: t }));
                        setShowClosePicker(false);
                        if (errors.closeTime)
                          setErrors((p) => ({ ...p, closeTime: undefined }));
                      }}
                      onClose={() => setShowClosePicker(false)}
                    />
                  </div>
                )}
              </div>
              {errors.closeTime && (
                <p className="mt-1 text-sm text-red-600">{errors.closeTime}</p>
              )}
            </div>
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
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo...</span>
              </>
            ) : uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang upload ảnh...</span>
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
