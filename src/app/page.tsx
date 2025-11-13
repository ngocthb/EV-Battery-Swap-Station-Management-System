"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import {
  Battery,
  Zap,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Monitor,
  TrendingUp,
  Shield,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";
import { Header } from "@/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { profile } from "console";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { User, KeyRound, LogOut } from "lucide-react";
import ClientOnly from "@/components/clients/ClientOnly";
import { ProxiedImage } from "@/components/proxiedImage/ProxiedImage";
import FeedbackPage from "./(user)/feedbacks/page";

// Partner logos data
const partnerLogos = [
  {
    src: "https://images.seeklogo.com/logo-png/42/1/vinfast-logo-png_seeklogo-425050.png",
    alt: "VinFast",
    width: 150,
    height: 60,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/320px-Tesla_Motors.svg.png",
    alt: "Tesla",
    width: 150,
    height: 60,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/NIO_logo.svg",
    alt: "NIO",
    width: 150,
    height: 60,
  },
  {
    src: "https://images.seeklogo.com/logo-png/54/1/byd-logo-png_seeklogo-546145.png",
    alt: "BYD",
    width: 150,
    height: 60,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Gogoro.svg",
    alt: "Gogoro",
    width: 150,
    height: 60,
  },
  {
    src: "https://www.logo.wine/a/logo/Contemporary_Amperex_Technology/Contemporary_Amperex_Technology-Logo.wine.svg",
    alt: "CATL",
    width: 150,
    height: 60,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Jaecoo_wordmark.svg/1200px-Jaecoo_wordmark.svg.png?20240106153034",
    alt: "Jaecoo",
    width: 150,
    height: 60,
  },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section - Redesigned */}
      <section id="home" className="relative pt-32 pb-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-blue-600">
                  Giải pháp hàng đầu Việt Nam
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Quản lý trạm
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  đổi pin xe điện
                </span>
                <br />
                thông minh
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Nền tảng toàn diện với giám sát thời gian thực, phân tích dữ
                liệu AI và vận hành tự động hóa hoàn toàn.
              </p>

              {/* Key features */}
              <div className="flex flex-col sm:flex-row gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Giám sát 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Phân tích AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Tự động hóa</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5">
                  <span className="flex items-center justify-center gap-2">
                    Bắt đầu ngay
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-0.5">
                  Xem demo
                </button>
              </div>
            </div>

            {/* Hero Image - Redesigned */}
            <div className="relative">
              <div className="relative">
                {/* Main image card */}
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="aspect-[4/3] relative">
                    <ProxiedImage
                      src="https://tramsacdien24h.com/wp-content/uploads/2024/12/tram-sac-vinfast-1-768x515.webp"
                      alt="Cơ sở hạ tầng thành phố thông minh"
                      fill
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40"></div>
                  </div>
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/30">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        99.8%
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        Thời gian hoạt động
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      2,500+ Trạm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <span className="text-sm font-medium text-blue-600">
                Tính năng nổi bật
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Giải pháp toàn diện cho
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                hạ tầng xe điện
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nền tảng tiên tiến giúp bạn quản lý, giám sát và tối ưu hóa toàn
              bộ hệ thống trạm đổi pin một cách hiệu quả nhất
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Battery className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Quản lý Pin</h3>
                <p className="text-blue-100 leading-relaxed">
                  Giám sát tình trạng, chu kỳ sạc và hiệu suất pin thời gian
                  thực với công nghệ IoT tiên tiến.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white border-2 border-gray-200 p-8 rounded-2xl hover:border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <BarChart3 className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Phân tích AI
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Công cụ phân tích thông minh dự đoán nhu cầu và tối ưu hóa hiệu
                quả vận hành.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white border-2 border-gray-200 p-8 rounded-2xl hover:border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <MapPin className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mạng lưới thông minh
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quản lý tập trung nhiều trạm với điều phối tự động và lập lịch
                thông minh.
              </p>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Xe điện"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8">
                <img
                  src="https://images.pexels.com/photos/2449452/pexels-photo-2449452.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Thành phố về đêm"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Giải pháp giám sát
                <br />
                <span className="text-blue-600">tiên tiến & toàn diện</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tối ưu hóa hiệu suất vận hành với công nghệ AI và IoT tiên tiến,
                mang lại trải nghiệm tốt nhất cho người dùng.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Monitor className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Giám sát thời gian thực
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Theo dõi mọi hoạt động 24/7 với dashboard trực quan
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Độ tin cậy cao
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Hệ thống ổn định với uptime 99.8%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Redesigned */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                <span className="text-sm font-medium text-blue-600">
                  Thành tựu của chúng tôi
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Dẫn đầu tương lai
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  giao thông xanh
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Hàng nghìn trạm trên toàn quốc tin tưởng sử dụng nền tảng của
                chúng tôi, cùng nhau xây dựng tương lai bền vững.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                    2,500+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Trạm hoạt động
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
                    50M+
                  </div>
                  <div className="text-gray-600 font-medium">Lượt đổi pin</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                    99.8%
                  </div>
                  <div className="text-gray-600 font-medium">
                    Uptime hệ thống
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-2">
                    45s
                  </div>
                  <div className="text-gray-600 font-medium">Thời gian TB</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <div className="relative rounded-2xl overflow-hidden mb-6 shadow-xl">
                  <img
                    src="https://vinfastquangninh.com.vn/wp-content/uploads/2021/03/tram-sac-dien-VinFast2.jpg"
                    alt="Hạ tầng xe điện"
                    className="w-full h-72 object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    Mạng lưới toàn cầu
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    Các trạm kết nối trên 50+ quốc gia, cung cấp dịch vụ đáng
                    tin cậy 24/7 với công nghệ hiện đại nhất.
                  </p>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Hoạt động 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section - Redesigned */}

      {/* Partners Section - Logo Marquee */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <span className="text-sm font-medium text-blue-600">
                Đối tác của chúng tôi
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Được tin tưởng bởi các thương hiệu hàng đầu
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Các nhà sản xuất và vận hành xe điện lớn nhất thế giới tin dùng
              giải pháp của chúng tôi
            </p>
          </div>

          {/* Inline Logo Marquee */}
          <div className="py-10 sm:py-14 mt-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="group relative w-full overflow-hidden bg-white rounded-2xl  h-32 sm:h-36 flex items-center">
                {/* Gradient fade effects on edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* Animated track */}
                <div
                  className="flex items-center gap-12 sm:gap-16 w-max will-change-transform group-hover:[animation-play-state:paused]"
                  style={{
                    animation: "marquee-left 40s linear infinite",
                  }}
                >
                  {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center px-4 sm:px-6 flex-shrink-0"
                      style={{ minWidth: "160px" }}
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt || "Partner Logo"}
                        width={logo.width || 150}
                        height={logo.height || 60}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-16 sm:max-h-20 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                        style={{ color: "transparent" }}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inline styles for animations */}
        <style jsx>{`
          @keyframes marquee-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      <FeedbackPage />

      {/* Contact Section - Redesigned */}

      {/* Footer - Redesigned */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Battery className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">EVSwap</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Dẫn đầu tương lai của hạ tầng xe điện với công nghệ đổi pin
                thông minh và bền vững.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="text-lg font-bold mb-6">Nền tảng</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Bảng điều khiển
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Phân tích
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Tích hợp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Công ty</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Báo chí
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Đối tác
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Hỗ trợ</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Tài liệu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Trạng thái
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 EVSwap. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Điều khoản dịch vụ
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      {user?.role == "USER" && <ChatWidget />}
    </div>
  );
}
