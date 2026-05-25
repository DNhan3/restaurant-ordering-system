import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Award, Truck, HeartHandshake, ChevronRight } from 'lucide-react';

const FEATURED_CATEGORIES = [
  {
    id: 'taco',
    name: 'Tacos',
    description: 'Authentic Mexican street tacos',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop',
    count: 12,
  },
  {
    id: 'burrito',
    name: 'Burritos',
    description: 'Hearty and delicious wraps',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    count: 8,
  },
  {
    id: 'nachos',
    name: 'Nachos',
    description: 'Loaded with cheese & toppings',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=400&fit=crop',
    count: 6,
  },
  {
    id: 'dessert',
    name: 'Desserts',
    description: 'Sweet endings to your meal',
    image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400&h=400&fit=crop',
    count: 5,
  },
];

const FEATURED_ITEMS = [
  {
    name: 'Carne Asada Tacos',
    description: 'Grilled steak, onions, cilantro, salsa verde',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop',
    rating: 4.9,
  },
  {
    name: 'Chicken Burrito Supreme',
    description: 'Seasoned chicken, rice, beans, cheese, sour cream',
    price: '$14.99',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop',
    rating: 4.8,
  },
  {
    name: 'Loaded Nachos',
    description: 'Tortilla chips, cheese, jalapeños, guacamole',
    price: '$10.99',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=400&fit=crop',
    rating: 4.7,
  },
];

const WHY_CHOOSE_US = [
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: '30-minute delivery guarantee or your order is free',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Fresh ingredients sourced daily from local farms',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on orders over $25',
  },
  {
    icon: HeartHandshake,
    title: '24/7 Support',
    description: 'Our team is always here to help you',
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="relative z-10 text-center lg:text-left">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm mb-6 animate-fade-in">
                Authentic Mexican Cuisine
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold heading-display leading-tight mb-6 animate-slide-up">
                Taste the <br />
                <span className="text-primary">Magic</span> of <br />
                Mexico
              </h1>
              
              <p className="text-lg text-brown-600 mb-8 max-w-lg mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Fresh ingredients, bold flavors, and recipes passed down through generations. 
                Experience the authentic taste of Mexico delivered to your door.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/menu" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                  Order Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/table-booking" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                  Book a Table
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-brown-500">Rating</div>
                </div>
                <div className="w-px h-12 bg-brown-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-brown-500">Menu Items</div>
                </div>
                <div className="w-px h-12 bg-brown-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">30min</div>
                  <div className="text-sm text-brown-500">Delivery</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=800&fit=crop"
                  alt="Delicious Mexican Tacos"
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
                    <span className="text-xl">🌮</span>
                  </div>
                  <div>
                    <p className="font-bold text-brown-900">Best Seller</p>
                    <p className="text-sm text-brown-500">Taco Trio</p>
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
            <span className="heading-accent text-xl">Explore Our Menu</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              Browse by Category
            </h2>
            <p className="text-brown-500 mt-3 max-w-2xl mx-auto">
              From classic street tacos to loaded burritos, find your perfect meal
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURED_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
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

      {/* Featured Items Section */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="heading-accent text-xl">Chef's Picks</span>
              <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
                Popular Dishes
              </h2>
            </div>
            <Link
              to="/menu"
              className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_ITEMS.map((item, index) => (
              <div key={index} className="card overflow-hidden group">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-brown-900 flex items-center gap-1">
                      <span className="text-secondary">★</span> {item.rating}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-brown-900 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-brown-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-primary">
                      {item.price}
                    </span>
                    <Link
                      to="/menu"
                      className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-primary font-medium"
            >
              View All Menu
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-primary to-primary-light rounded-3xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
              <div className="text-white">
                <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Get 50% Off Your First Order!
                </h2>
                <p className="text-white/80 text-lg mb-6">
                  Use code <span className="font-bold">WELCOME50</span> at checkout. 
                  Valid for new customers only.
                </p>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-cream transition-colors"
                >
                  Claim Your Discount
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&h=600&fit=crop"
                  alt="Delicious Mexican Food"
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="heading-accent text-xl">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              What Makes Us Special
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
          <h2 className="text-3xl md:text-4xl font-bold heading-display mb-4">
            Ready to Experience the Best Mexican Food?
          </h2>
          <p className="text-brown-300 text-lg mb-8">
            Order online or book a table for an unforgettable dining experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary text-lg px-8 py-4">
              Order Online
            </Link>
            <Link to="/table-booking" className="bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              Book a Table
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
