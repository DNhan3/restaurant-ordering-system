import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Award, Truck, HeartHandshake, ChevronRight, Leaf } from 'lucide-react';

const FEATURED_CATEGORIES = [
  {
    id: 'pho',
    name: 'Phở & Bún',
    description: 'Phở bò, phở gà, bún bò huế',
    image: '/imgs/pho-category.jpg',
    count: 8,
  },
  {
    id: 'com',
    name: 'Cơm',
    description: 'Cơm tấm, cơm gà, cơm rang',
    image: '/imgs/com-category.jpg',
    count: 6,
  },
  {
    id: 'banhmi',
    name: 'Bánh Mì',
    description: 'Bánh mì thịt nướng, bánh mì pate',
    image: '/imgs/banhmi-category.jpg',
    count: 5,
  },
  {
    id: 'cuon',
    name: 'Cuốn & Khai Vị',
    description: 'Gỏi cuốn, chả giò, nem nướng',
    image: '/imgs/cuon-category.jpg',
    count: 7,
  },
];

const WHY_CHOOSE_US = [
  {
    icon: Clock,
    title: 'Giao Nhanh',
    description: 'Giao hàng trong 30 phút và miễn phí',
  },
  {
    icon: Award,
    title: 'Nguyên Liệu Tươi',
    description: 'Thực phẩm tươi sạch, nhập hàng mỗi ngày',
  },
  {
    icon: Leaf,
    title: 'Không Phụ Gia',
    description: 'Nấu ăn chuẩn công thức gia truyền',
  },
  {
    icon: HeartHandshake,
    title: 'Hỗ Trợ 24/7',
    description: 'Đội ngũ luôn sẵn sàng giúp đỡ bạn',
  },
];

export default function HomePage() {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-cream">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4   '%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="relative z-10 text-center lg:text-left">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm mb-6 animate-fade-in">
                Ẩm Thực Việt Nam Chuẩn Vị
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold heading-display leading-tight mb-6 animate-slide-up">
                Chuẩn Cơm <br />
                <span className="text-primary inline-block text-6xl sm:text-7xl lg:text-8xl">Mẹ Nấu!</span> <br />
                
              </h1>
              
              <p className="text-lg text-brown-600 mb-8 max-w-lg mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Hương vị gia truyền, nấu kỹ bằng tình yêu và nguyên liệu tươi sạch.
                <br/>  
                Đặt ngay để cảm nhận sự ấm áp, thân thuộc như ở nhà.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/menu" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                  Đặt Món Ngay
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/table-booking" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                  Đặt Bàn
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-brown-500">Đánh Giá</div>
                </div>
                <div className="w-px h-12 bg-brown-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">36+</div>
                  <div className="text-sm text-brown-500">Món Ăn</div>
                </div>
                <div className="w-px h-12 bg-brown-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">30ph</div>
                  <div className="text-sm text-brown-500">Giao Hàng</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=600&fit=crop"
                  alt="Phở Bò Việt Nam"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
              
              {/* Floating Badge */}
              <div className="absolute top-8 -left-4 lg:left-8 bg-white rounded-2xl shadow-xl p-4 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🍜</span>
                  </div>
                  <div>
                    <p className="font-bold text-brown-900">Món Bán Chạy</p>
                    <p className="text-sm text-brown-500">Phở Bò Hà Nội</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="heading-accent text-xl">Khám Phá Thực Đơn</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              Danh Mục Món Ăn
            </h2>
            <p className="text-brown-500 mt-3 max-w-2xl mx-auto">
              Từ phở bò truyền thống đến bánh mì thịt nướng, tìm món ăn hoàn hảo cho bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURED_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group card overflow-hidden p-4 md:p-6 text-center hover:border-primary border-2 border-transparent transition-all"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-semibold text-lg text-brown-900 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-brown-500 mt-1">
                  {category.count} items
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="heading-accent text-xl">Vì Sao Chọn Chúng Tôi</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              Điều Gì Làm Chúng Tôi Đặc Biệt
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-cream hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-brown-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-brown-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-brown-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold heading-display mb-4 text-white">
            Sẵn Sàng Thưởng Thức Ẩm Thực Việt?
          </h2>
          <p className="text-brown-300 text-lg mb-8">
            Đặt món online hoặc đặt bàn để có trải nghiệm ẩm thực đáng nhớ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary text-lg px-8 py-4">
              Đặt Món
            </Link>
            <Link to="/table-booking" className="bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              Đặt Bàn
            </Link>
          </div>
        </div>
      </section>
      <br />
      <br />
    </div>
  );
}
