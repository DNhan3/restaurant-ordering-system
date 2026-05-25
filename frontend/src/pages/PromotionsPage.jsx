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
    title: 'Combo Bánh Mì + Trà Đá',
    description: 'Mua 1 bánh mì được tặng 1 trà đá miễn phí!',
    conditions: ['Áp dụng tất cả các loại bánh mì', 'Không kết hợp với khuyến mãi khác'],
    badge: 'Miễn phí',
    badgeColor: 'bg-secondary',
    image: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=600&h=400&fit=crop',
    code: null,
  },
  {
    id: 3,
    title: 'Gỏi Cuốn Tặng Kèm',
    description: 'Đơn hàng từ 150.000đ được tặng 1 phần gỏi cuốn!',
    conditions: ['Tối thiểu đơn 150.000đ', 'Chỉ online'],
    badge: 'Tặng kèm',
    badgeColor: 'bg-success',
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
      <div className="bg-gradient-to-r from-secondary to-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="heading-accent text-2xl">Ưu Đãi Đặc Biệt</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-2">Khuyến Mãi</h1>
          <p className="text-white/80">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROMOTIONS.map((promo) => (
              <div key={promo.id} className="card overflow-hidden group">
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

                <div className="p-6">
                  <h3 className="text-xl font-bold text-brown-900 mb-2">{promo.title}</h3>
                  <p className="text-brown-600 mb-4">{promo.description}</p>

                  <ul className="space-y-1 mb-4">
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
                    className="btn-primary w-full text-center block"
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

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Giờ</th>
                    <th className="px-6 py-4 text-left font-semibold">Chương Trình</th>
                    <th className="px-6 py-4 text-left font-semibold">Ưu Đãi</th>
                    <th className="px-6 py-4 text-center font-semibold hidden sm:table-cell">Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brown-100">
                  {SCHEDULE.map((item, index) => (
                    <tr key={index} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-brown-900">{item.time}</td>
                      <td className="px-6 py-4 text-brown-700">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 bg-success/10 text-success font-semibold px-3 py-1 rounded-full text-sm">
                          <Percent className="w-4 h-4" />
                          {item.discount}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <span
                              key={day}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                item.days.includes(day)
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-brown-100 text-brown-400'
                              }`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
