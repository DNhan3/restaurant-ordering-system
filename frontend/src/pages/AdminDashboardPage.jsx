import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw, Check, X, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/api';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }
    loadOrders();
  }, [admin, navigate]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrderDetails = async (billId) => {
    try {
      setIsLoadingDetails(true);
      const details = await orderService.getOrderDetails(billId);
      setOrderDetails(details);
    } catch (error) {
      console.error('Failed to load order details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    await loadOrderDetails(order.bill_id);
  };

  const handleNextStatus = async (billId) => {
    try {
      await orderService.updateStatus(billId);
      loadOrders();
      if (selectedOrder?.bill_id === billId) {
        const updated = orders.find((o) => o.bill_id === billId);
        if (updated) {
          setSelectedOrder({ ...updated, bill_status: updated.bill_status + 1 });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleMarkPaid = async (billId) => {
    try {
      await orderService.updatePaid(billId);
      loadOrders();
    } catch (error) {
      console.error('Failed to mark as paid:', error);
    }
  };

  const handleCancel = async (billId) => {
    try {
      await orderService.cancelOrder(billId);
      loadOrders();
      if (selectedOrder?.bill_id === billId) {
        setSelectedOrder(null);
        setOrderDetails([]);
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
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

  if (!admin) {
    return null;
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-brown-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-brown-300 mt-1">Manage orders and track deliveries</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 bg-brown-800 rounded-lg hover:bg-brown-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-light transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="xl" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Orders Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-brown-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-brown-500">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.bill_id} className="hover:bg-cream/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-brown-900">#{order.bill_id}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-brown-900">{order.bill_phone}</p>
                              <p className="text-sm text-brown-500 truncate max-w-[150px]">{order.bill_address}</p>
                            </td>
                            <td className="px-4 py-3 font-semibold text-primary">${order.bill_total}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.bill_status)}`}>
                                {ORDER_STATUS_LABELS[order.bill_status] || 'Unknown'}
                              </span>
                              {order.bill_paid === 'true' && (
                                <span className="ml-2 inline-flex items-center gap-1 text-xs text-success">
                                  <DollarSign className="w-3 h-3" />
                                  Paid
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => handleViewDetails(order)}
                                  className="text-sm text-primary hover:underline"
                                >
                                  View Details
                                </button>
                                {order.bill_status > 0 && order.bill_status < 5 && (
                                  <button
                                    onClick={() => handleNextStatus(order.bill_id)}
                                    className="text-sm text-success hover:underline flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    {ORDER_STATUS_LABELS[order.bill_status + 1]}
                                  </button>
                                )}
                                {order.bill_paid !== 'true' && (
                                  <button
                                    onClick={() => handleMarkPaid(order.bill_id)}
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    Mark Paid
                                  </button>
                                )}
                                {order.bill_status > 0 && order.bill_status < 5 && (
                                  <button
                                    onClick={() => handleCancel(order.bill_id)}
                                    className="text-sm text-error hover:underline flex items-center gap-1"
                                  >
                                    <X className="w-3 h-3" />
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Details Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                {selectedOrder ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg text-brown-900">Order #{selectedOrder.bill_id}</h3>
                      <button
                        onClick={() => {
                          setSelectedOrder(null);
                          setOrderDetails([]);
                        }}
                        className="p-1 hover:bg-brown-100 rounded"
                      >
                        <X className="w-5 h-5 text-brown-400" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brown-400" />
                        <span className="text-sm text-brown-600">{selectedOrder.bill_when}</span>
                      </div>
                      <div>
                        <span className="text-sm text-brown-500">Address:</span>
                        <p className="text-brown-900">{selectedOrder.bill_address}</p>
                      </div>
                      <div>
                        <span className="text-sm text-brown-500">Phone:</span>
                        <p className="text-brown-900">{selectedOrder.bill_phone}</p>
                      </div>
                    </div>

                    <div className="border-t border-brown-100 pt-4">
                      <h4 className="font-semibold text-brown-900 mb-3">Items</h4>
                      {isLoadingDetails ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <ul className="space-y-2">
                          {orderDetails.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span className="text-brown-700">Item #{item.food_id}</span>
                              <span className="font-medium">x{item.item_qty}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="border-t border-brown-100 pt-4 mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-brown-500">Subtotal</span>
                        <span className="text-brown-900">${selectedOrder.bill_total - selectedOrder.bill_delivery}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brown-500">Discount</span>
                        <span className="text-success">-${selectedOrder.bill_discount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brown-500">Delivery</span>
                        <span className="text-brown-900">${selectedOrder.bill_delivery}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-brown-100">
                        <span>Total</span>
                        <span className="text-primary">${selectedOrder.bill_total}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-brown-500">
                    <p>Select an order to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
