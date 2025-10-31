"use client";

import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";
import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";
import { Header } from "@/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section id="home" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                HỆ THỐNG
                <br />
                <span className="text-blue-600">QUẢN LÝ TRẠM</span>
                <br />
                ĐỔI PIN XE ĐIỆN
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Nền tảng cách mạng để quản lý các trạm đổi pin xe điện với giám
                sát thời gian thực, phân tích dữ liệu và vận hành tự động.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Bắt đầu ngay
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Xem demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-600 rounded-3xl transform rotate-3 h-96 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Cơ sở hạ tầng thành phố thông minh"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      99.8%
                    </div>
                    <div className="text-sm text-gray-600">
                      Thời gian hoạt động
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Xe điện"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="https://images.pexels.com/photos/2449452/pexels-photo-2449452.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Thành phố về đêm"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Giải pháp giám sát tiên tiến cho hạ tầng xe điện của bạn
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nền tảng toàn diện của chúng tôi cung cấp thông tin chi tiết
                thời gian thực về tình trạng pin, hiệu suất trạm và hiệu quả vận
                hành để tối đa hóa đầu tư hạ tầng xe điện của bạn.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Giám sát thời gian thực</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-600 text-white p-8 rounded-xl">
              <Battery className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-3">Quản lý Pin</h3>
              <p className="text-blue-100 leading-relaxed">
                Giám sát tình trạng pin, chu kỳ sạc và các chỉ số hiệu suất thời
                gian thực trên tất cả các trạm.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-xl">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Phân tích dữ liệu
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Công cụ phân tích và báo cáo tiên tiến để tối ưu hóa hoạt động
                và dự đoán nhu cầu bảo trì.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-xl">
              <MapPin className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mạng lưới trạm
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quản lý tập trung nhiều trạm đổi pin với điều phối và lập lịch
                tự động.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Thúc đẩy tương lai của giao thông điện
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tham gia cùng hàng nghìn trạm trên toàn thế giới sử dụng nền
                tảng của chúng tôi để mang lại trải nghiệm đổi pin liền mạch.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    2,500+
                  </div>
                  <div className="text-gray-600">Trạm hoạt động</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    50M+
                  </div>
                  <div className="text-gray-600">Lượt đổi pin</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    99.8%
                  </div>
                  <div className="text-gray-600">Thời gian hoạt động</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    45s
                  </div>
                  <div className="text-gray-600">Thời gian đổi pin TB</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-600 p-8 rounded-xl">
                <img
                  src="https://images.pexels.com/photos/15031003/pexels-photo-15031003.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Hạ tầng xe điện"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    Mạng lưới toàn cầu
                  </h3>
                  <p className="text-blue-100">
                    Các trạm kết nối trên 50+ quốc gia cung cấp dịch vụ đáng tin
                    cậy 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bảng điều khiển thông minh
            </h2>
            <p className="text-xl text-gray-600">
              Trung tâm điều khiển toàn diện cho tất cả hoạt động đổi pin của
              bạn
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Trạng thái trạm
                </h3>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Trạm hoạt động</span>
                  <span className="font-semibold">248/250</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pin có sẵn</span>
                  <span className="font-semibold">1,847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đang bảo trì</span>
                  <span className="font-semibold text-orange-600">12</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Hiệu suất
                </h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tỷ lệ hiệu quả</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thời gian đổi pin TB</span>
                  <span className="font-semibold">45s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hài lòng khách hàng</span>
                  <span className="font-semibold text-green-600">4.9/5</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bảo mật</h3>
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Trạng thái bảo mật</span>
                  <span className="font-semibold text-green-600">An toàn</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kiểm tra cuối</span>
                  <span className="font-semibold">2 ngày trước</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tuân thủ</span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Được tin tưởng bởi các nhà lãnh đạo ngành
            </h2>
            <p className="text-gray-600">
              Các nhà sản xuất và vận hành xe điện hàng đầu tin tưởng nền tảng
              của chúng tôi
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-white px-6 py-3 rounded-lg font-bold text-gray-700">
              VinFast
            </div>
            <div className="bg-white px-6 py-3 rounded-lg font-bold text-gray-700">
              Tesla
            </div>
            <div className="bg-white px-6 py-3 rounded-lg font-bold text-gray-700">
              NIO
            </div>
            <div className="bg-white px-6 py-3 rounded-lg font-bold text-gray-700">
              BYD
            </div>
            <div className="bg-white px-6 py-3 rounded-lg font-bold text-gray-700">
              Gogoro
            </div>
            <div className="bg-white px-6 py-3 rounded-lg font-bold text-gray-700">
              CATL
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-blue-600 p-12 rounded-2xl text-white">
              <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Sẵn sàng chuyển đổi hoạt động đổi pin xe điện của bạn? Liên hệ
                với đội ngũ của chúng tôi để được tư vấn và demo cá nhân hóa.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6" />
                  <span>+84 (028) 123-4567</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6" />
                  <span>lienhe@evswap.vn</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6" />
                  <span>Thành phố Hồ Chí Minh, Việt Nam</span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-blue-500">
                <h3 className="text-xl font-semibold mb-4">Hành động nhanh</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Đặt lịch demo
                  </button>
                  <button className="border border-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors">
                    Tải brochure
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Biểu mẫu liên hệ
                </h3>
                <p className="text-gray-600">
                  Gửi tin nhắn cho chúng tôi và chúng tôi sẽ phản hồi trong vòng
                  24 giờ.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Nguyễn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Văn A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="nguyenvana@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Hãy cho chúng tôi biết về dự án của bạn..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Battery className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EVSwap</span>
              </div>
              <p className="text-gray-400">
                Dẫn đầu tương lai của hạ tầng xe điện với các giải pháp đổi pin
                thông minh.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Nền tảng</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bảng điều khiển
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Phân tích
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tích hợp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Công ty</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Báo chí
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Đối tác
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tài liệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trạng thái
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 EVSwap. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 sm:mt-0">
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
