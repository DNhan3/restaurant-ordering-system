import { Link } from 'react-router-dom';
import { Utensils, ArrowRight, Users, Award, Clock, Globe } from 'lucide-react';

const TEAM_PHOTOS = [
  {
    name: 'Chef. Đức Nhân',
    role: 'Bếp Trưởng',
    image: 'public/DNhan.jpg',
  },
  {
    name: 'Chef. Nguyên Trung',
    role: 'Chuyên Gia Phở',
    image: 'public/NTrung.png',
  },
  {
    name: 'Chef. Triều Hưng',
    role: 'Nghệ Nhân Bánh Mì',
    image: 'public/THung.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <section className="relative bg-brown-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1555126634-323283e090fa?w=1600&h=800&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="heading-accent text-2xl">Câu Chuyện Của Chúng Tôi</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Về VN<span className="text-primary">Food</span>
            </h1>
            <p className="text-lg text-brown-300 leading-relaxed">
              Được thành lập từ năm 2016 bởi những người có niềm đam mê với ẩm thực Việt,
              VNFood đã phục vụ hàng nghìn khách hàng với những món ăn ngon chuẩn vị.
              Từ một quán nhỏ ven đường, giờ đây chúng tôi mang đến hương vị Việt đến mọi nhà.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="heading-accent text-xl">Sứ Mệnh Của Chúng Tôi</span>
              <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2 mb-6">
                Mang Hương Vị Việt Đến Mọi Nhà
              </h2>
              <p className="text-brown-600 leading-relaxed mb-6">
                Chúng tôi tin rằng ẩm thực Việt có sức mạnh kết nối con người và tạo nên
                những kỷ niệm đáng nhớ. Mỗi món ăn đều được chế biến tỉ mỉ với tình yêu,
                sử dụng nguyên liệu tươi sạch và công thức gia truyền.
              </p>
              <p className="text-brown-600 leading-relaxed mb-8">
                Từ tô phở nóng hổi đến đĩa cơm tấm đậm đà, mỗi món trong thực đơn đều
                thể hiện sự cam kết của chúng tôi với chất lượng và sự hài lòng của khách hàng.
              </p>
              <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                Khám Phá Thực Đơn
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-primary">10+</span>
                  <p className="text-brown-600 mt-1">Năm Kinh Nghiệm</p>
                </div>
                <div className="bg-secondary/10 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-secondary">36+</span>
                  <p className="text-brown-600 mt-1">Món Ăn</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-brown-100 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-brown-700">1000+</span>
                  <p className="text-brown-600 mt-1">Khách Hàng</p>
                </div>
                <div className="bg-success/10 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-success">4.9</span>
                  <p className="text-brown-600 mt-1">Đánh Giá Trung Bình</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="heading-accent text-xl">Giá Trị Cốt Lõi</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              Những Điều Chúng Tôi Tin Tưởng
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: 'Cộng Đồng',
                description: 'Kết nối mọi người qua những bữa ăn ngon',
              },
              {
                icon: Award,
                title: 'Chất Lượng',
                description: 'Sử dụng nguyên liệu tươi sạch nhất',
              },
              {
                icon: Clock,
                title: 'Truyền Thống',
                description: 'Giữ gìn công thức nấu ăn Việt cổ truyền',
              },
              {
                icon: Globe,
                title: 'Phát Triển',
                description: 'Không ngừng cải tiến nhưng giữ nguyên hương vị',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-brown-900 mb-2">{value.title}</h3>
                <p className="text-sm text-brown-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="heading-accent text-xl">Gặp Gỡ Đội Ngũ</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              Những Người Tạo Nên VNFood
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_PHOTOS.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Users className="w-16 h-16" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-brown-900">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Utensils className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn Sàng Trải Nghiệm VNFood?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Hãy cùng chúng tôi khám phá hương vị ẩm thực Việt Nam đích thực
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-cream transition-colors">
              Đặt Món
            </Link>
            <Link to="/table-booking" className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              Đặt Bàn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
