import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

export default function QuickViewModal({ food, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !food) return null;

  const {
    food_name: name,
    food_desc: description,
    food_price: price,
    food_discount: discount = 0,
    food_image: image,
    food_vote: vote = 0,
    food_status: status = [],
  } = food;

  const discountedPrice = parseFloat(price) - parseFloat(discount);
  const hasDiscount = parseFloat(discount) > 0;

  const handleAddToCart = () => {
    if (!user) {
      onClose();
      return;
    }
    setIsAdding(true);
    addItem(food, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 800);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brown-900/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <X className="w-6 h-6 text-brown-700" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 aspect-square md:aspect-auto">
            <img
              src={image || '/images/placeholder-food.png'}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop`;
              }}
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            {/* Category */}
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              {food.food_category || 'Main Course'}
            </span>

            {/* Name */}
            <h2 className="text-2xl md:text-3xl font-bold heading-display text-brown-900 mb-3">
              {name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(vote || 0)
                        ? 'fill-secondary text-secondary'
                        : 'text-brown-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-brown-500">({vote || 0} đánh giá)</span>
            </div>

            {/* Description */}
            <p className="text-brown-600 mb-6 flex-1">
              {description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-brown-400 line-through">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-brown-700 font-medium">Số lượng:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 rounded-xl border-2 border-brown-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 rounded-xl border-2 border-brown-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            {user ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isAdding
                    ? 'bg-success text-white'
                    : 'bg-primary text-white hover:bg-primary-light active:scale-[0.98]'
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAdding ? 'Đã Thêm!' : 'Thêm Vào Giỏ'}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-brown-500">
                  Vui lòng đăng nhập để thêm món vào giỏ hàng
                </p>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full py-4 rounded-xl font-semibold bg-primary text-white text-center hover:bg-primary-light transition-colors"
                >
                  Đăng Nhập Ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}