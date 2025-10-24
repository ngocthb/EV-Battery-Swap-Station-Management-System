"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { toast } from "react-toastify";
import { Camera, Trash2, Loader2, Check } from "lucide-react";
import { UserLayout } from "@/layout/UserLayout";

const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [tab, setTab] = useState<"profile" | "password">("profile");

  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [errors, setErrors] = useState<{ fullName?: string }>({});

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");

      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateProfile = () => {
    const next: { fullName?: string } = {};
    if (!fullName.trim()) next.fullName = "Vui lòng nhập họ và tên";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    setIsSaving(true);
    try {
      let avatarUrl = user?.avatar || "";
      if (selectedFile) {
        avatarUrl = await uploadFileToCloudinary(selectedFile);
      }
      await authService.updateProfile({ fullName, avatar: avatarUrl });
      toast.success("Cập nhật thông tin thành công");
      refreshProfile?.();
      setSelectedFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cập nhật thất bại";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đổi mật khẩu thất bại";
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <UserLayout>
      <div className="px-16">
        <h2 className="text-2xl font-semibold mb-6">Hồ sơ của tôi</h2>

        <div className="grid grid-cols-12 gap-6">
          {/* Left profile card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <div className="w-full flex justify-center mb-3">
                  <div
                    className="inline-flex rounded-md bg-gray-100 shadow-sm"
                    role="tablist"
                  >
                    <button
                      onClick={() => setTab("profile")}
                      className={`px-4 py-2 text-sm ${
                        tab === "profile"
                          ? "bg-white text-gray-900 shadow"
                          : "text-gray-600"
                      }`}
                      role="tab"
                      aria-selected={tab === "profile"}
                    >
                      Thông tin
                    </button>
                    <button
                      onClick={() => setTab("password")}
                      className={`px-4 py-2 text-sm ${
                        tab === "password"
                          ? "bg-white text-gray-900 shadow"
                          : "text-gray-600"
                      }`}
                      role="tab"
                      aria-selected={tab === "password"}
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>

                {tab === "profile" ? (
                  <>
                    <div className="relative w-28 h-28 bg-transparent">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        {avatarPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarPreview}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                            {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>

                      <label
                        className="absolute -bottom-3 -right-2 bg-white rounded-full p-1 shadow cursor-pointer flex items-center justify-center z-10"
                        aria-label="Chọn ảnh đại diện"
                        tabIndex={0}
                        role="button"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </label>
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mt-4">
                      Họ và tên
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`mt-2 block w-full border rounded p-2 ${
                        errors.fullName ? "border-red-300" : "border-gray-200"
                      }`}
                      type="text"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.fullName}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang lưu</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Lưu thay đổi</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setFullName(user?.fullName || "");
                          setSelectedFile(null);
                          setAvatarPreview(user?.avatar || null);
                          setErrors({});
                        }}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                    </div>

                    <div className="w-full mt-6 space-y-3 text-sm text-gray-600">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="mt-1 text-gray-900 text-sm">
                          {user?.email}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-500">Giới tính</div>
                        <div className="mt-1 text-gray-900 text-sm">Nữ</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full mt-6">
                    <div className="p-2 w-full">
                      <h3 className="text-lg font-medium mb-4">Đổi mật khẩu</h3>
                      <div className="grid grid-cols-1 gap-4 max-w-md">
                        <div>
                          <label className="block text-sm text-gray-600">
                            Mật khẩu hiện tại
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-2 block w-full border rounded p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600">
                            Mật khẩu mới
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-2 block w-full border rounded p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600">
                            Xác nhận mật khẩu mới
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-2 block w-full border rounded p-2"
                          />
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                          >
                            {isChangingPassword
                              ? "Đang đổi..."
                              : "Đổi mật khẩu"}
                          </button>
                          <button
                            onClick={() => {
                              setCurrentPassword("");
                              setNewPassword("");
                              setConfirmPassword("");
                            }}
                            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Top stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">All Bookings</div>
                  <div className="text-2xl font-semibold text-blue-600">5</div>
                </div>
                <div className="w-16 h-10 bg-gray-50 rounded flex items-end">
                  <div className="w-2 h-6 bg-blue-300 rounded ml-1" />
                  <div className="w-2 h-8 bg-blue-400 rounded ml-1" />
                  <div className="w-2 h-4 bg-blue-200 rounded ml-1" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Completed</div>
                  <div className="text-2xl font-semibold text-purple-600">
                    2
                  </div>
                </div>
                <div className="w-16 h-10 bg-gray-50 rounded flex items-end">
                  <div className="w-2 h-3 bg-purple-200 rounded ml-1" />
                  <div className="w-2 h-7 bg-purple-300 rounded ml-1" />
                  <div className="w-2 h-5 bg-purple-100 rounded ml-1" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Cancelled</div>
                  <div className="text-2xl font-semibold text-orange-600">
                    5
                  </div>
                </div>
                <div className="w-16 h-10 bg-gray-50 rounded flex items-end">
                  <div className="w-2 h-4 bg-orange-200 rounded ml-1" />
                  <div className="w-2 h-5 bg-orange-300 rounded ml-1" />
                  <div className="w-2 h-6 bg-orange-400 rounded ml-1" />
                </div>
              </div>
            </div>

            {/* Main panel: appointments list */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Appointments</h3>
                <div className="text-sm text-gray-500">All Time (5)</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="text-sm font-medium">29 Sep</div>
                    <div className="text-sm text-gray-600">
                      Plumbing — 11:00-13:00
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">$50</div>
                    <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="text-sm font-medium">15 Oct</div>
                    <div className="text-sm text-gray-600">
                      Carpentry — 13:45-15:30
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">$345</div>
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                      Booked
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="text-sm font-medium">11 Nov</div>
                    <div className="text-sm text-gray-600">
                      Painting — 09:00-12:30
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">$130</div>
                    <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700">
                      Done
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;
