import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ChevronDown, ChevronUp, MapPin, Phone, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { billingService } from '../services/api';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import { formatPrice } from '../utils/formatters';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BillingPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBill, setExpandedBill] = useState(null);
  const [billDetails, setBillDetails] = useState({});
  const [cancelingBillId, setCancelingBillId] = useState(null);

  useEffect(() => {
    if (user) {
      loadBills();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadBills = async () => {
    try {
      setIsLoading(true);
      const data = await billingService.getUserBills(user.user_id);
      setBills(data);
    } catch (error) {
      console.error('Failed to load bills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBillDetails = async (billId) => {
    if (billDetails[billId]) return;

    try {
      const details = await billingService.getBillDetails(billId);
      setBillDetails((prev) => ({ ...prev, [billId]: details }));
    } catch (error) {
      console.error('Failed to load bill details:', error);
    }
  };

  const toggleBillDetails = async (bill) => {
    if (expandedBill === bill.bill_id) {
      setExpandedBill(null);
    } else {
      setExpandedBill(bill.bill_id);
      await loadBillDetails(bill.bill_id);
    }
  };

  const canCancelBill = (status) => status > 0 && status < 4;

  const handleCancelBill = async (event, bill) => {
    event.stopPropagation();

    if (!canCancelBill(bill.bill_status)) return;

    const shouldCancel = window.confirm(`Hủy đơn hàng #${bill.bill_id}?`);
    if (!shouldCancel) return;

    try {
      setCancelingBillId(bill.bill_id);
      const updated = await billingService.cancelBill(bill.bill_id);
      setBills((prev) =>
        prev.map((currentBill) =>
          currentBill.bill_id === bill.bill_id ? updated : currentBill,
        ),
      );
    } catch (error) {
      console.error('Failed to cancel bill:', error);
    } finally {
      setCancelingBillId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      0: 'bg-gray-100 text-gray-700',
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-yellow-100 text-yellow-700',
      3: 'bg-purple-100 text-purple-700',
      4: 'bg-orange-100 text-orange-700',
      5: 'bg-green-100 text-green-700',
      6: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getProgressSteps = (status) => {
    const steps = ['Đã Xác Nhận', 'Đang Chuẩn Bị', 'Đang Kiểm Tra', 'Đang Giao', 'Đã Giao'];
    const currentIndex = status - 1;
    return steps.map((step, index) => ({
      name: step,
      completed: index < currentIndex,
      current: index === currentIndex,
    }));
  };

  if (!user) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-brown-900 mb-4">Vui Lòng Đăng Nhập</h2>
          <p className="text-brown-500 mb-6">Bạn cần đăng nhập để xem hóa đơn.</p>
          <Link to="/login" className="btn-primary">
            Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-cream min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="bg-cream min-h-screen">
        <EmptyState
          icon={Receipt}
          title="Chưa có đơn hàng"
          description="Lịch sử đặt hàng và hóa đơn của bạn sẽ xuất hiện tại đây."
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hóa Đơn</h1>
          <p className="text-white/80">
            Theo dõi trạng thái đơn hàng, thanh toán và hóa đơn
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {bills.map((bill) => {
            const isExpanded = expandedBill === bill.bill_id;
            const steps = getProgressSteps(bill.bill_status);
            const details = billDetails[bill.bill_id] || [];

            return (
              <div key={bill.bill_id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Bill Header */}
                <div
                  className="p-4 md:p-6 cursor-pointer hover:bg-cream/50 transition-colors"
                  onClick={() => toggleBillDetails(bill)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-brown-900">
                          Bill #{bill.bill_id}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.bill_status)}`}>
                          {ORDER_STATUS_LABELS[bill.bill_status]}
                        </span>
                        {bill.bill_paid === 'true' && (
                          <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                            Đã Thanh Toán
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-brown-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(bill.bill_when).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {bill.bill_address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {bill.bill_phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{formatPrice(bill.bill_total)}</p>
                        <p className="text-sm text-brown-500">Tổng Cộng</p>
                      </div>
                      {canCancelBill(bill.bill_status) && (
                        <button
                          type="button"
                          onClick={(event) => handleCancelBill(event, bill)}
                          disabled={cancelingBillId === bill.bill_id}
                          className="inline-flex items-center gap-1 rounded-lg border border-error/30 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          {cancelingBillId === bill.bill_id ? 'Đang Hủy' : 'Hủy Đơn'}
                        </button>
                      )}
                      <Link
                        to={`/orders/${bill.bill_id}/receipt`}
                        onClick={(event) => event.stopPropagation()}
                        className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                          <Receipt className="w-4 h-4" />
                          Hóa Đơn
                        </Link>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-brown-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-brown-400" />
                      )}
                    </div>
                  </div>

                  {/* Progress Steps */}
                  {bill.bill_status > 0 && bill.bill_status < 6 && (
                    <div className="mt-4 pt-4 border-t border-brown-100">
                      <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                          <div key={step.name} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.completed
                                    ? 'bg-success text-white'
                                    : step.current
                                      ? 'bg-primary text-white'
                                      : 'bg-brown-200 text-brown-500'
                                  }`}
                              >
                                {step.completed ? '✓' : index + 1}
                              </div>
                              <span className={`text-xs mt-1 ${step.current ? 'text-primary font-medium' : 'text-brown-500'}`}>
                                {step.name}
                              </span>
                            </div>
                            {index < steps.length - 1 && (
                              <div
                                className={`w-full h-1 mx-2 ${step.completed ? 'bg-success' : 'bg-brown-200'
                                  }`}
                                style={{ minWidth: '20px', maxWidth: '60px' }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bill Details */}
                {isExpanded && (
                  <div className="border-t border-brown-100 bg-cream/30 p-4 md:p-6 animate-fade-in">
                    {billDetails[bill.bill_id] ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-brown-900">Các Món</h4>
                        <div className="grid gap-3">
                          {details.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-xl">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-brown-100 flex-shrink-0">
                                {item.food?.food_image ? (
                                  <img
                                    src={item.food.food_image}
                                    alt={item.food?.food_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-brown-400">
                                    No image
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-brown-900">{item.food?.food_name || `Món #${item.food_id}`}</p>
                                <p className="text-sm text-brown-500">SL: {item.item_qty}</p>
                              </div>
                              <p className="font-semibold text-primary">
                                {formatPrice((parseFloat(item.food?.food_price || 0) - parseFloat(item.food?.food_discount || 0)) * item.item_qty)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-brown-100 pt-4 mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-brown-500">Giảm Giá</span>
                            <span className="text-success">-{formatPrice(bill.bill_discount)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-brown-500">Phí Giao Hàng</span>
                            <span className="text-brown-900">{formatPrice(bill.bill_delivery)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg">
                            <span>Tổng Cộng</span>
                            <span className="text-primary">{formatPrice(bill.bill_total)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <LoadingSpinner size="sm" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}