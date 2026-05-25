import { Link } from 'react-router-dom';
import { ChefHat, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brown-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold heading-display">Subscribe to Our Newsletter</h3>
              <p className="text-cream/90 mt-1">Get exclusive deals and updates delivered to your inbox</p>
            </div>
            <form className="w-full lg:w-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-4 py-3 rounded-xl text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="bg-brown-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brown-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold heading-display">
                Q<span className="text-primary">Food</span>
              </span>
            </Link>
            <p className="text-brown-300 text-sm leading-relaxed mb-4">
              Authentic Mexican cuisine crafted with passion. Fresh ingredients, bold flavors, 
              and a dining experience that brings joy to every bite.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-brown-800 rounded-lg hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-brown-800 rounded-lg hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-brown-800 rounded-lg hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Menu</h4>
            <ul className="space-y-2">
              {['Tacos', 'Burritos', 'Nachos', 'Side Dishes', 'Desserts', 'Drinks'].map((item) => (
                <li key={item}>
                  <Link
                    to="/menu"
                    className="text-brown-300 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/promotions', label: 'Promotions' },
                { to: '/table-booking', label: 'Book a Table' },
                { to: '/menu', label: 'Order Online' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-brown-300 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-brown-300 text-sm">
                  02 Duong Khue, Cau Giay, Ha Noi, Viet Nam
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+84123123123" className="text-brown-300 hover:text-primary transition-colors text-sm">
                  +84 123 123 123
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@qfood.com" className="text-brown-300 hover:text-primary transition-colors text-sm">
                  info@qfood.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-brown-300 text-sm">
                  Everyday: 7:00 AM - 10:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brown-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-brown-400 text-sm">
              &copy; {currentYear} QFood Restaurant. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-brown-400 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-brown-400 hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
