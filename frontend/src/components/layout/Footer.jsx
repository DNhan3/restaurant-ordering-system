import { Link } from 'react-router-dom';
import { Utensils, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brown-900 text-white">
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold heading-display">Đăng Ký Nhận Tin</h3>
              <p className="text-white/90 mt-1">Nhận ưu đãi đặc biệt và cập nhật món mới</p>
            </div>
            <form className="w-full lg:w-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 lg:w-72 px-4 py-3 rounded-xl text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="bg-brown-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brown-800 transition-colors"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Utensils className="w-8 h-8 text-primary" />
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-bold heading-display text-white">
                  VN<span className="text-red-400">Food</span>
                </span>
              </div>
            </Link>
            <p className="text-brown-300 text-sm leading-relaxed mb-4">
              Hương vị Việt Nam chuẩn vị mẹ nấu. Nguyên liệu tươi sạch, công thức gia truyền,
              mang đến trải nghiệm ẩm thực đậm đà ngay tại nhà.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Thực Đơn</h4>
            <ul className="space-y-2">
              {['Phở & Bún', 'Cơm', 'Bánh Mì', 'Cuốn & Khai Vị', 'Đồ Uống', 'Combo'].map((item) => (
                <li key={item}>
                  <Link to="/menu" className="text-brown-300 hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Liên Kết</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Trang Chủ' },
                { to: '/about', label: 'Giới Thiệu' },
                { to: '/table-booking', label: 'Đặt Bàn' },
                { to: '/menu', label: 'Đặt Món' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-brown-300 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-brown-300 text-sm">
                  36 Phố Nông, Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+84123456789" className="text-brown-300 hover:text-primary transition-colors text-sm">
                  +84 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@vnfood.vn" className="text-brown-300 hover:text-primary transition-colors text-sm">
                  info@vnfood.vn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-brown-300 text-sm">Mỗi ngày: 7:00 - 22:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brown-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-brown-400 text-sm text-center">
            &copy; {currentYear} VNFood. Chuẩn cơm mẹ nấu. Mọi quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
