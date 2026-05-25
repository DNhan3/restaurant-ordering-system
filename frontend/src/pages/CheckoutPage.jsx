import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Banknote, Check, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import EmptyState from '../components/common/EmptyState';
import { DELIVERY_FEE } from '../utils/constants';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotalDiscount, clearCart } = useCart();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    phone: user?.user_phone || '',
    address: '',
    paymentMethod: 'cash',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!formData.phone.startsWith('84') || formData.phone.length !== 11) {
      newErrors.phone = 'Phone must start with 84 and be 11 digits';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Delivery address is required';
    }

    // Card validation (if card payment)
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!formData.cardNumber.startsWith('4') || formData.cardNumber.length !== 16) {
        newErrors.cardNumber = 'Card must start with 4 and be 16 digits';
      }

      if (!formData.cardName) {
        newErrors.cardName = 'Cardholder name is required';
      }

      if (!formData.cardExpiry) {
        newErrors.cardExpiry = 'Expiry date is required';
      }

      if (!formData.cardCvv) {
        newErrors.cardCvv = 'CVV is required';
      } else if (formData.cardCvv.length !== 3) {
        newErrors.cardCvv = 'CVV must be 3 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear cart and redirect
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Checkout failed:', error);
      setErrors({ submit: 'Failed to process order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen">
        <EmptyState
          icon={CreditCard}
          title="Nothing to checkout"
          description="Your cart is empty. Add some items before checking out."
          actionLabel="Browse Menu"
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
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay Lại Giỏ Hàng
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Thanh Toán</h1>
          <p className="text-white/80">Hoàn tất đơn hàng của bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-brown-900 mb-6">Thông Tin Giao Hàng</h2>

              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">
                    Số Điện Thoại <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="84123456789"
                    className={`input-field ${errors.phone ? 'border-error focus:border-error' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">
                    Địa Chỉ Giao Hàng <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Nhập địa chỉ giao hàng đầy đủ"
                    className={`input-field resize-none ${errors.address ? 'border-error focus:border-error' : ''}`}
                  />
                  {errors.address && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-brown-900 mb-6">Phương Thức Thanh Toán</h2>

              <div className="space-y-4">
                {/* Payment Options */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'cash'
                        ? 'border-primary bg-primary/5'
                        : 'border-brown-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.paymentMethod === 'cash' ? 'bg-primary text-white' : 'bg-brown-100'
                    }`}>
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-brown-900">Tiền Mặt</p>
                      <p className="text-sm text-brown-500">Thanh toán khi nhận hàng</p>
                    </div>
                    {formData.paymentMethod === 'cash' && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-primary bg-primary/5'
                        : 'border-brown-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.paymentMethod === 'card' ? 'bg-primary text-white' : 'bg-brown-100'
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-brown-900">Thẻ</p>
                      <p className="text-sm text-brown-500">Thẻ nội địa & quốc tế</p>
                    </div>
                    {formData.paymentMethod === 'card' && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </label>
                </div>

                {/* Card Details */}
                {formData.paymentMethod === 'card' && (
                  <div className="p-4 bg-cream rounded-xl space-y-4 animate-fade-in">
                    <p className="text-sm text-brown-600">
                      Enter your card details (Visa only)
                    </p>

                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-2">
                        Card Number <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="4111111111111111"
                        maxLength={16}
                        className={`input-field ${errors.cardNumber ? 'border-error focus:border-error' : ''}`}
                      />
                      {errors.cardNumber && (
                        <p className="text-error text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-2">
                        Cardholder Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="JOHN DOE"
                        className={`input-field ${errors.cardName ? 'border-error focus:border-error' : ''}`}
                      />
                      {errors.cardName && (
                        <p className="text-error text-sm mt-1">{errors.cardName}</p>
                      )}
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brown-700 mb-2">
                          Expiry Date <span className="text-error">*</span>
                        </label>
                        <input
                          type="month"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className={`input-field ${errors.cardExpiry ? 'border-error focus:border-error' : ''}`}
                        />
                        {errors.cardExpiry && (
                          <p className="text-error text-sm mt-1">{errors.cardExpiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brown-700 mb-2">
                          CVV <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          placeholder="123"
                          maxLength={3}
                          className={`input-field ${errors.cardCvv ? 'border-error focus:border-error' : ''}`}
                        />
                        {errors.cardCvv && (
                          <p className="text-error text-sm mt-1">{errors.cardCvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-error/10 text-error rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errors.submit}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-brown-900 mb-6">Tóm Tắt Đơn Hàng</h2>

              {/* Items Preview */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.foodId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-brown-100 flex-shrink-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brown-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-brown-500">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-brown-900">
                      {((item.price - item.discount) * item.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-brown-200 pt-4 space-y-3">
                <div className="flex justify-between text-brown-700">
                  <span>Tạm tính</span>
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

                <div className="border-t border-brown-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-brown-900">
                    <span>Tổng Cộng</span>
                    <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang Xử Lý...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Đặt Hàng - {total.toLocaleString('vi-VN')}đ
                  </>
                )}
              </button>

              {/* Security Note */}
              <p className="text-xs text-brown-500 text-center mt-4">
                Thanh toán được bảo mật với mã hóa SSL
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
