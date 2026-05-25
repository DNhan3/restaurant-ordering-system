import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
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
          Thank You!
        </h1>
        <p className="text-lg text-brown-600 mb-2">
          Your order has been placed successfully!
        </p>
        <p className="text-brown-500 mb-8">
          We've sent you an email with your order details. Our team is preparing your food 
          and will deliver it to you soon.
        </p>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-brown-100">
              <span className="text-brown-500">Order ID</span>
              <span className="font-semibold text-brown-900">#{Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-brown-100">
              <span className="text-brown-500">Estimated Delivery</span>
              <span className="font-semibold text-brown-900">30-45 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brown-500">Status</span>
              <span className="inline-flex items-center gap-1 text-success font-semibold">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Confirmed
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
            Back to Home
          </Link>
          <Link
            to="/menu"
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-brown-500 mt-8">
          Questions about your order?{' '}
          <a href="tel:+84123123123" className="text-primary font-medium hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
