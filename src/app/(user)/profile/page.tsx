"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  ChangeEvent,
  FormEvent,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  User as UserIcon,
  Mail,
  Save,
  ImageIcon,
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { setUser } from "@/store/slices/authSlice";
import { userService } from "@/services/userService";

function normalizeUrl(u: string) {
  return (u ?? "").trim().replace(/^['"]|['"]$/g, "");
}
function isHttpUrl(u: string) {
  if (!u) return true; // avatar optional
  try {
    const x = new URL(u);
    return x.protocol === "http:" || x.protocol === "https:";
  } catch {
    return false;
  }
}
function pickErr(e: any, fallback = "Có lỗi xảy ra.") {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    (Array.isArray(e?.response?.data?.errors)
      ? e.response.data.errors.map((x: any) => x?.message ?? x).join(", ")
      : undefined) ||
    e?.message ||
    fallback
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.user);

  const [formData, setFormData] = useState({ fullName: "", avatar: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName ?? "",
        avatar: currentUser.avatar ?? "",
      });
    } else {
      setFormData({ fullName: "", avatar: "" });
    }
  }, [currentUser]);

  const hasChanges = useMemo(() => {
    if (!currentUser) return false;
    return (
      (formData.fullName ?? "") !== (currentUser.fullName ?? "") ||
      (formData.avatar ?? "") !== (currentUser.avatar ?? "")
    );
  }, [formData, currentUser]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !hasChanges || isLoading) return;

    const payload = {
      fullName: (formData.fullName ?? "").trim(),
      avatar: normalizeUrl(formData.avatar ?? ""),
    };

    if (!payload.fullName) {
      setError("Họ và tên không được để trống.");
      return;
    }
    if (!isHttpUrl(payload.avatar)) {
      setError("URL ảnh đại diện không hợp lệ.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedFromServer = await userService.updateProfile(payload);
      const optimistic = updatedFromServer ?? { ...currentUser, ...payload };

      dispatch(setUser(optimistic));
      setFormData({
        fullName: optimistic.fullName ?? "",
        avatar: optimistic.avatar ?? "",
      });

      userService
        .meNoCache()
        .then((fresh) => {
          if (!isMounted.current) return;
          dispatch(setUser(fresh));
          setFormData({
            fullName: fresh.fullName ?? "",
            avatar: fresh.avatar ?? "",
          });
          setSuccess("Cập nhật thông tin thành công!");
          ộ;
          startTransition(() => {
            router.refresh();
          });
        })
        .catch(() => {
          if (!isMounted.current) return;
          setSuccess("Cập nhật thông tin thành công!");
        });
    } catch (err: any) {
      if (!isMounted.current) return;
      setError(pickErr(err, "Cập nhật thông tin thất bại."));
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  const avatarSrc = formData.avatar
    ? `${formData.avatar}${
        formData.avatar.includes("?") ? "&" : "?"
      }v=${Date.now()}`
    : "";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thông tin cá nhân
        </h1>

        {/* Banners */}
        {success && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <CheckCircle2 className="h-5 w-5 mt-0.5" />
            <p className="text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột trái */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
              <Avatar
                key={formData.avatar} // ép remount khi URL đổi
                src={avatarSrc}
                name={
                  (formData.fullName ?? "") ||
                  currentUser.username ||
                  currentUser.email ||
                  "User"
                }
                size={128}
                className="mb-4 text-5xl"
              />
              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {(formData.fullName ?? "") ||
                    currentUser.fullName ||
                    "Người dùng"}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentUser.email ?? ""}
                </p>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <Shield className="w-3 h-3" />
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl shadow-sm space-y-6"
            >
              {/* Họ và tên */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName ?? ""}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* URL ảnh đại diện */}
              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL ảnh đại diện
                </label>
                <div className="relative">
                  <ImageIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar ?? ""}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.png"
                    inputMode="url"
                    autoComplete="photo"
                  />
                </div>
              </div>

              {/* Email readonly */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="email"
                    value={currentUser.email ?? ""}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 justify-center rounded-lg border border-gray-300 bg-white py-2 px-6 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !hasChanges}
                  className="inline-flex items-center gap-2 justify-center rounded-lg bg-blue-600 py-2 px-6 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                  title={!hasChanges ? "Không có thay đổi để lưu" : undefined}
                >
                  {isLoading ? (
                    "Đang lưu..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
