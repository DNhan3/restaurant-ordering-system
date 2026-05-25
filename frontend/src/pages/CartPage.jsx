import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Phone } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import EmptyState from '../components/common/EmptyState';
import { DELIVERY_FEE } from '../utils/constants';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTotalDiscount,
    getTotalItems
  } = useCart();

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen">
        <EmptyState
          icon={ShoppingBag}
          title="Giỏ hàng trống"
          description="Bạn chưa thêm món nào vào giỏ hàng. Hãy khám phá thực đơn để tìm những món ăn ngon!"
          actionLabel="Xem Thực Đơn"
          actionTo="/menu"
        />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Giỏ Hàng</h1>
          <p className="text-white/80">
            {getTotalItems()} {getTotalItems() === 1 ? 'món' : 'món'} trong giỏ hàng
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Continue Shopping */}
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Tiếp Tục Mua Sắm
            </Link>

            {/* Items List */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {items.map((item, index) => (
                <div
                  key={item.foodId}
                  className={`p-4 md:p-6 ${
                    index !== items.length - 1 ? 'border-b border-brown-100' : ''
                  }`}
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-brown-100">
                      <img
                        src={item.image || 'https://via.placeholder.com/200'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-brown-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-brown-500 mt-1">
                            Đơn giá: {(item.price - item.discount).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.foodId)}
                          className="p-2 text-brown-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                            className="w-10 h-10 rounded-xl border-2 border-brown-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                            className="w-10 h-10 rounded-xl border-2 border-brown-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            {((item.price - item.discount) * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                          {item.discount > 0 && (
                            <p className="text-sm text-brown-400 line-through">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Savings Badge */}
                      {item.discount > 0 && (
                        <div className="mt-3">
                          <span className="inline-flex items-center gap-1 bg-success/10 text-success text-sm font-medium px-3 py-1 rounded-full">
                            Tiết kiệm {(item.discount * item.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-error hover:text-red-600 font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xóa Giỏ Hàng
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-brown-900 mb-6">Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-brown-700">
                  <span>Tạm tính ({getTotalItems()} món)</span>
                  <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Giảm Giá</span>
                    <span className="font-medium">-{discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                <div className="flex justify-between text-brown-700">
                  <span>Phí Giao Hàng</span>
                  <span className="font-medium">{deliveryFee.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="border-t border-brown-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-brown-900">
                    <span>Tổng Cộng</span>
                    <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full btn-primary py-4 mt-6 text-center block rounded-xl font-bold text-lg"
              >
                Thanh Toán
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/menu"
                className="w-full btn-secondary py-4 mt-3 text-center block rounded-xl"
              >
                Tiếp Tục Mua Sắm
              </Link>

              {/* Support */}
              <div className="mt-6 p-4 bg-cream rounded-xl">
                <p className="text-sm text-brown-600 mb-2">Cần hỗ trợ về đơn hàng?</p>
                <a
                  href="tel:+84123456789"
                  className="flex items-center gap-2 text-primary font-medium hover:text-primary-light"
                >
                  <Phone className="w-4 h-4" />
                  +84 123 456 789
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
