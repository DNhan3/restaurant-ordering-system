import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw, Check, X, DollarSign, Clock, ImagePlus, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { foodService, orderService } from '../services/api';
import { CATEGORIES, ORDER_STATUS_LABELS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const initialFoodForm = {
  name: '',
  price: '',
  description: '',
  image: '',
  category: 'pho',
};

export default function AdminDashboardPage() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [foodForm, setFoodForm] = useState(initialFoodForm);
  const [foodImageFile, setFoodImageFile] = useState(null);
  const [foodImagePreview, setFoodImagePreview] = useState('');
  const [isSavingFood, setIsSavingFood] = useState(false);
  const [foodMessage, setFoodMessage] = useState('');

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }
    loadOrders();
    loadFoods();
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
      const updated = await orderService.updateStatus(billId);
      setOrders((prev) =>
        prev.map((order) => (order.bill_id === billId ? updated : order)),
      );
      setSelectedOrder((current) =>
        current?.bill_id === billId ? updated : current,
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const loadFoods = async () => {
    try {
      const data = await foodService.getAll();
      setFoods(data);
    } catch (error) {
      console.error('Failed to load foods:', error);
    }
  };

  const handleFoodInputChange = (event) => {
    const { name, value } = event.target;
    setFoodForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFoodImageChange = (event) => {
    const file = event.target.files?.[0];
    setFoodImageFile(file || null);
    setFoodImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const handleCreateFood = async (event) => {
    event.preventDefault();
    setFoodMessage('');

    try {
      setIsSavingFood(true);
      let image = foodForm.image;

      if (foodImageFile) {
        const upload = await foodService.uploadImage(foodImageFile);
        image = upload.imageUrl;
      }

      await foodService.create({
        name: foodForm.name.trim(),
        price: Number(foodForm.price),
        description: foodForm.description.trim(),
        image,
        category: foodForm.category,
      });

      setFoodForm(initialFoodForm);
      setFoodImageFile(null);
      setFoodImagePreview('');
      setFoodMessage('Dish created successfully.');
      await loadFoods();
    } catch (error) {
      console.error('Failed to create food:', error);
      setFoodMessage(error.response?.data?.message || 'Failed to create dish.');
    } finally {
      setIsSavingFood(false);
    }
  };

  const handleMarkPaid = async (billId) => {
    try {
      const updated = await orderService.updatePaid(billId);
      setOrders((prev) =>
        prev.map((order) => (order.bill_id === billId ? updated : order)),
      );
      setSelectedOrder((current) =>
        current?.bill_id === billId ? updated : current,
      );
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
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-brown-900">Create Dish</h2>
                  <p className="text-sm text-brown-500 mt-1">Upload a thumbnail and save it with the menu item.</p>
                </div>
              </div>

              <form onSubmit={handleCreateFood} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Dish name</label>
                  <input
                    type="text"
                    name="name"
                    value={foodForm.name}
                    onChange={handleFoodInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={foodForm.price}
                    onChange={handleFoodInputChange}
                    className="input-field"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={foodForm.category}
                    onChange={handleFoodInputChange}
                    className="input-field"
                  >
                    {CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Thumbnail</label>
                  <label className="flex items-center justify-center gap-2 h-12 px-4 border-2 border-dashed border-brown-200 rounded-lg text-brown-600 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-sm font-medium">{foodImageFile ? foodImageFile.name : 'Choose image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFoodImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brown-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={foodForm.image}
                    onChange={handleFoodInputChange}
                    className="input-field"
                    placeholder="Optional when uploading a file"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brown-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={foodForm.description}
                    onChange={handleFoodInputChange}
                    className="input-field min-h-[96px]"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingFood}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingFood ? 'Saving...' : 'Save Dish'}
                  </button>
                  {foodMessage && (
                    <span className="text-sm text-brown-600">{foodMessage}</span>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:w-1/3">
              <div className="aspect-square rounded-xl overflow-hidden bg-brown-100 mb-4">
                {foodImagePreview || foodForm.image ? (
                  <img
                    src={foodImagePreview || foodForm.image}
                    alt="Food thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brown-400">
                    <ImagePlus className="w-12 h-12" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-brown-900 mb-3">Latest Dishes</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {foods.slice(-5).reverse().map((food) => (
                  <div key={food.food_id} className="flex items-center gap-3">
                    <img
                      src={food.food_image || '/images/placeholder-food.png'}
                      alt={food.food_name}
                      className="w-12 h-12 rounded-lg object-cover bg-brown-100"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-brown-900 truncate">{food.food_name}</p>
                      <p className="text-xs text-brown-500">{food.food_category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
                              <span className="text-brown-700">
                                {item.food?.food_name || `Item #${item.food_id}`}
                              </span>
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
