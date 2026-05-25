import { Link } from 'react-router-dom';
import { Percent, Gift, Coffee, ArrowRight } from 'lucide-react';

const PROMOTIONS = [
  {
    id: 1,
    title: 'Giảm 20% Phở & Bún',
    description: 'Đặt bất kỳ tô phở hoặc bún nào được giảm 20%!',
    conditions: ['Chỉ áp dụng buổi trưa (10h-14h)', 'Chỉ giao hàng'],
    badge: 'Giảm 20%',
    badgeColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1583224964978-2257b1c8f725?w=600&h=400&fit=crop',
    code: 'PHO20',
  },
  {
    id: 2,
    title: '🎂 Ưu Đãi Sinh Nhật',
    description: 'Đặt bàn đúng ngày sinh nhật và nhận miễn phí 1 món tráng miệng!',
    conditions: ['Cần xác minh ngày sinh với nhân viên', 'Áp dụng cho đặt bàn trực tiếp'],
    badge: 'Miễn Phí',
    badgeColor: 'bg-success',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&h=400&fit=crop',
    code: null,
  },
  {
    id: 3,
    title: 'Combo Bánh Mì + Trà Đá',
    description: 'Mua 1 bánh mì được tặng 1 trà đá miễn phí!',
    conditions: ['Áp dụng tất cả các loại bánh mì', 'Không kết hợp với khuyến mãi khác'],
    badge: 'Miễn phí',
    badgeColor: 'bg-secondary',
    image: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=600&h=400&fit=crop',
    code: null,
  },
  {
    id: 4,
    title: 'Gỏi Cuốn Tặng Kèm',
    description: 'Đơn hàng từ 150.000đ được tặng 1 phần gỏi cuốn!',
    conditions: ['Tối thiểu đơn 150.000đ', 'Chỉ online'],
    badge: 'Tặng kèm',
    badgeColor: 'bg-herb',
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=600&h=400&fit=crop',
    code: 'GOICUON',
  },
];

const SCHEDULE = [
  { time: '7:00 - 9:00', name: 'Sáng Sớm', discount: 'Giảm 10%', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { time: '10:00 - 14:00', name: 'Trưa Vui Vẻ', discount: 'Tặng Trà', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { time: '15:00 - 17:00', name: 'Chiều Xế', discount: 'Giảm 15%', days: ['Mon', 'Wed', 'Fri', 'Sat'] },
  { time: '18:00 - 21:00', name: 'Tối Đặc Biệt', discount: 'Giảm 20%', days: ['Tue', 'Thu', 'Sat', 'Sun'] },
];

export default function PromotionsPage() {
  return (
    <div className="bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-secondary text-white py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium">Ưu Đãi Đặc Biệt</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4">
            Khuyến Mãi
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Khám phá các ưu đãi mới nhất và tiết kiệm khi đặt món yêu thích
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Promotions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold heading-display text-brown-900 mb-8">
            Ưu Đãi Nổi Bật
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROMOTIONS.map((promo) => (
              <div key={promo.id} className="card overflow-hidden group flex flex-col">
                <div className="relative">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 ${promo.badgeColor} text-white font-bold px-4 py-2 rounded-full`}>
                    {promo.badge}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-brown-900 mb-2">{promo.title}</h3>
                  <p className="text-brown-600 mb-4">{promo.description}</p>

                  <ul className="space-y-1 mb-4 flex-grow">
                    {promo.conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-brown-500">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {condition}
                      </li>
                    ))}
                  </ul>

                  {promo.code && (
                    <div className="bg-cream rounded-lg p-3 mb-4">
                      <span className="text-xs text-brown-500">Mã Khuyến Mãi:</span>
                      <p className="font-mono font-bold text-primary">{promo.code}</p>
                    </div>
                  )}

                  <Link
                    to="/menu"
                    className="btn-primary w-full text-center block mt-auto"
                  >
                    Nhận Ưu Đãi
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Schedule */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold heading-display text-brown-900 mb-8">
            Lịch Khuyến Mãi Trong Ngày
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEDULE.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border-2 border-primary/20 overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-3">
                  <p className="text-sm opacity-90">🕐 {item.time}</p>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h4 className="font-bold text-brown-900 text-lg mb-2">{item.name}</h4>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-success/20 text-success font-bold px-4 py-2 rounded-full text-sm">
                      <Percent className="w-4 h-4" />
                      {item.discount}
                    </span>
                  </div>
                  
                  {/* Days */}
                  <div className="flex flex-wrap gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <span
                        key={day}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.days.includes(day)
                            ? 'bg-primary text-white'
                            : 'bg-brown-100 text-brown-400'
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-r from-primary to-primary-light rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nhận Ưu Đãi Độc Quyền</h3>
                <p className="text-white/80">Đăng ký newsletter để nhận ưu đãi mới nhất</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="bg-brown-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brown-800 transition-colors flex items-center gap-2">
                Đăng Ký
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
