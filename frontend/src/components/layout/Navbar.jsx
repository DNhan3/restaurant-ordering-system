import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, ClipboardList, ChefHat } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const cartCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Trang Chủ' },
    { to: '/about', label: 'Giới Thiệu' },
    { to: '/promotions', label: 'Khuyến Mãi' },
    { to: '/menu', label: 'Thực Đơn' },
    { to: '/table-booking', label: 'Đặt Bàn' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <ChefHat className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold heading-display">
                36<span className="text-primary">Food</span>
              </span>
              <span className="text-[10px] text-brown-500 -mt-1">Chuẩn cơm mẹ nấu</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-brown-700 hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-brown-100 transition-colors group"
            >
              <ShoppingCart className="w-6 h-6 text-brown-700 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-brown-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.user_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-brown-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-brown-100">
                      <p className="font-semibold text-brown-900 truncate">
                        {user.user_name}
                      </p>
                      <p className="text-sm text-brown-500 truncate">
                        {user.user_email}
                      </p>
                    </div>
                    <Link
                      to="/billing"
                      className="flex items-center gap-2 px-4 py-2 text-brown-700 hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Billing
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-brown-700 hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-brown-700 font-medium hover:text-primary transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Đăng Ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-brown-100 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-brown-700" />
              ) : (
                <Menu className="w-6 h-6 text-brown-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-brown-100 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-brown-700 hover:bg-primary/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {!user && (
                <>
                  <div className="border-t border-brown-100 my-2" />
                  <Link
                    to="/login"
                    className="px-4 py-3 text-brown-700 font-medium hover:bg-primary/5 rounded-lg"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/register"
                    className="mx-4 my-2 btn-primary text-center"
                  >
                    Đăng Ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
