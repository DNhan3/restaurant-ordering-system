import { useState } from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';

export default function FoodCard({ food, onQuickView }) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const {
    food_name: name,
    food_desc: description,
    food_price: price,
    food_discount: discount = 0,
    food_image: image,
    food_vote: vote = 0,
    food_status: status = [],
    food_category: category,
    food_available: available = true,
  } = food;

  const discountedPrice = parseFloat(price) - parseFloat(discount);
  const hasDiscount = parseFloat(discount) > 0;
  const isBestSeller = status.includes('best seller');
  const isNew = status.includes('new dishes');
  const isOnlineOnly = status.includes('online only');

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!available) return;
    setIsAdding(true);
    addItem(food, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="card group overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-brown-100">
        <img
          src={image || '/images/placeholder-food.png'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop`;
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!available && (
            <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full">
              Không Có Sẵn
            </span>
          )}
          {isBestSeller && (
            <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
              Bán Chạy Nhất
            </span>
          )}
          {isNew && (
            <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded-full">
              Mới
            </span>
          )}
          {isOnlineOnly && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Chỉ Online
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
              -{Math.round((parseFloat(discount) / parseFloat(price)) * 100)}%
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={() => onQuickView?.(food)}
          className="absolute inset-0 bg-brown-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
            <Eye className="w-5 h-5 text-primary" />
          </div>
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4">
        {/* Category */}
        <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
          {category || 'Món Chín'}
        </span>

        {/* Name */}
        <h3 className="font-semibold text-lg text-brown-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(vote || 0)
                    ? 'fill-secondary text-secondary'
                    : 'text-brown-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-brown-500">({vote || 0})</span>
        </div>

        {/* Description */}
        <p className="text-sm text-brown-500 mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-brown-400 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || !available}
            className={`p-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${isAdding
                ? 'bg-success text-white'
                : !available
                  ? 'bg-brown-200 text-brown-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-light hover:shadow-lg active:scale-95'
              }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">
              {!available ? 'Unavailable' : isAdding ? 'Đã Thêm!' : 'Thêm'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
