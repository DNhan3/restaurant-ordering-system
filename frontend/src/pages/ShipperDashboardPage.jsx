import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, LogOut, Package, MapPin, Phone, Clock,
  CheckCircle, XCircle, RefreshCw, AlertTriangle, ChefHat,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { shipperService } from '../services/api';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import { getDashboardPath } from '../utils/authHelpers';

const POLL_INTERVAL = 5000;

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const getStatusLabel = (status) => ORDER_STATUS_LABELS[status] ?? 'Không rõ';

const STATUS_COLORS = {
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-yellow-100 text-yellow-700',
  3: 'bg-green-100 text-green-700',
  4: 'bg-purple-100 text-purple-700',
  5: 'bg-emerald-100 text-emerald-700',
  6: 'bg-gray-100 text-gray-600',
  0: 'bg-red-100 text-red-700',
};

export default function ShipperDashboardPage() {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();

  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrder, setMyOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'shipper')) {
      navigate(getDashboardPath(user?.role));
    }
  }, [user, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const [available, current] = await Promise.all([
        shipperService.getAvailableOrders(),
        shipperService.getMyOrder(),
      ]);
      setAvailableOrders(available);
      setMyOrder(current);
      setError('');
    } catch (err) {
      console.error('Poll error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'shipper') return;
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData, user]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const handleLogout = () => {
    logout();
  };

  const handleAccept = async (billId) => {
    try {
      setActionLoading(true);
      setError('');
      await shipperService.acceptOrder(billId);
      setSuccessMsg('Đã nhận đơn hàng!');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể nhận đơn');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async (billId) => {
    try {
      setActionLoading(true);
      setError('');
      await shipperService.denyOrder(billId);
      setSuccessMsg('Đã hủy nhận đơn');
      setMyOrder(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể hủy đơn');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePickup = async (billId) => {
    try {
      setActionLoading(true);
      setError('');
      await shipperService.pickupOrder(billId);
      setSuccessMsg('Đã lấy hàng — đang giao!');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Chưa thể lấy hàng');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelivered = async (billId) => {
    try {
      setActionLoading(true);
      setError('');
      await shipperService.deliveredOrder(billId);
      setSuccessMsg('Giao hàng thành công!');
      setMyOrder(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || user.role !== 'shipper') return null;

  const isReadyForPickup = myOrder?.bill_status === 3;
  const isDelivering = myOrder?.bill_status === 4;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-7 h-7 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                36<span className="text-blue-600">Ship</span>
              </h1>
              <p className="text-xs text-gray-500">Xin chào, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Status messages */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Active Order Section */}
        {myOrder && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Đơn Hàng Hiện Tại
            </h2>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-blue-100">
              {/* Ready for pickup notification */}
              {isReadyForPickup && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex items-center gap-3 animate-pulse">
                  <ChefHat className="w-8 h-8 shrink-0" />
                  <div>
                    <p className="font-bold text-lg">Món ăn đã sẵn sàng!</p>
                    <p className="text-green-100 text-sm">Đến nhà hàng lấy hàng ngay</p>
                  </div>
                </div>
              )}

              {/* Delivering notification */}
              {isDelivering && (
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 flex items-center gap-3">
                  <Truck className="w-8 h-8 shrink-0" />
                  <div>
                    <p className="font-bold text-lg">Đang giao hàng</p>
                    <p className="text-purple-100 text-sm">Giao xong hãy nhấn "Đã giao"</p>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Order info */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Đơn #{myOrder.bill_id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[myOrder.bill_status] || 'bg-gray-100 text-gray-600'}`}>
                    {getStatusLabel(myOrder.bill_status)}
                  </span>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`h-2 flex-1 rounded-full transition-all duration-500 ${myOrder.bill_status >= step ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 px-1">
                  <span>Xác nhận</span>
                  <span>Chuẩn bị</span>
                  <span>Sẵn sàng</span>
                  <span>Đang giao</span>
                  <span>Đã giao</span>
                </div>

                {/* Delivery info */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {myOrder.bill_address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{myOrder.bill_address}</span>
                    </div>
                  )}
                  {myOrder.bill_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-gray-700">{myOrder.bill_phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-gray-500">Tổng tiền:</span>
                    <span className="font-bold text-gray-900 text-lg">{formatCurrency(myOrder.bill_total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Thanh toán:</span>
                    <span className="text-gray-700 capitalize">{myOrder.bill_payment_method}</span>
                  </div>
                </div>

                {/* Items */}
                {myOrder.bill_details?.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">Món ăn:</p>
                    <div className="space-y-1">
                      {myOrder.bill_details.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.food?.food_name || `Món #${item.food_id}`} × {item.item_qty}
                          </span>
                          <span className="text-gray-500">{formatCurrency(item.item_price * item.item_qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-3">
                  {!isDelivering && !isReadyForPickup && (
                    <button
                      onClick={() => handleDeny(myOrder.bill_id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Hủy nhận đơn
                    </button>
                  )}
                  {isReadyForPickup && (
                    <button
                      onClick={() => handlePickup(myOrder.bill_id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                    >
                      <Truck className="w-6 h-6" />
                      Lấy Hàng
                    </button>
                  )}
                  {isDelivering && (
                    <button
                      onClick={() => handleDelivered(myOrder.bill_id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                    >
                      <CheckCircle className="w-6 h-6" />
                      Đã Giao
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Available Orders Section */}
        {!myOrder && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Đơn Hàng Đang Chờ
              </h2>
              <button
                onClick={fetchData}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Làm mới
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-gray-500 mt-3">Đang tải...</p>
              </div>
            ) : availableOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">Chưa có đơn hàng mới</h3>
                <p className="text-gray-400 mt-1 text-sm">Đơn hàng sẽ tự động hiển thị khi có</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Đang cập nhật mỗi 5 giây
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {availableOrders.map((order) => (
                  <div
                    key={order.bill_id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-bold text-gray-900">Đơn #{order.bill_id}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.bill_status] || 'bg-gray-100'}`}>
                          {getStatusLabel(order.bill_status)}
                        </span>
                      </div>
                      <span className="font-bold text-blue-600 text-lg">{formatCurrency(order.bill_total)}</span>
                    </div>

                    {order.bill_address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span>{order.bill_address}</span>
                      </div>
                    )}
                    {order.bill_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{order.bill_phone}</span>
                      </div>
                    )}

                    {order.bill_details?.length > 0 && (
                      <p className="text-xs text-gray-400 mb-3">
                        {order.bill_details.length} món — {order.bill_details.map(d => d.food?.food_name || `#${d.food_id}`).join(', ')}
                      </p>
                    )}

                    <button
                      onClick={() => handleAccept(order.bill_id)}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Nhận Đơn
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
