import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Receipt, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="bg-cream min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-success/10 rounded-full flex items-center justify-center mx-auto animate-bounce-in">
            <CheckCircle className="w-16 h-16 text-success" />
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl md:text-4xl font-bold heading-display text-brown-900 mb-4">
          Cảm Ơn Bạn!
        </h1>
        <p className="text-lg text-brown-600 mb-2">
          Đơn hàng của bạn đã được đặt thành công!
        </p>
        <p className="text-brown-500 mb-8">
          Chúng tôi đã gửi email với chi tiết đơn hàng. Đội ngũ đang chuẩn bị món ăn 
          và sẽ giao đến bạn sớm nhất có thể.
        </p>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-brown-100">
              <span className="text-brown-500">Mã Đơn Hàng</span>
              <span className="font-semibold text-brown-900">
                {orderId ? `#${orderId}` : 'Processing'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-brown-100">
              <span className="text-brown-500">Dự Kiến Giao Hàng</span>
              <span className="font-semibold text-brown-900">30-45 phút</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brown-500">Trạng Thái</span>
              <span className="inline-flex items-center gap-1 text-success font-semibold">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Đã Xác Nhận
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Về Trang Chủ
          </Link>
          {orderId && (
            <Link
              to={`/orders/${orderId}/receipt`}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Receipt className="w-5 h-5" />
              View Receipt
            </Link>
          )}
          <Link
            to="/menu"
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Tiếp Tục Mua Sắm
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-brown-500 mt-8">
          Câu hỏi về đơn hàng?{' '}
          <a href="tel:+84123456789" className="text-primary font-medium hover:underline">
            Liên hệ với chúng tôi
          </a>
        </p>
      </div>
    </div>
  );
}
