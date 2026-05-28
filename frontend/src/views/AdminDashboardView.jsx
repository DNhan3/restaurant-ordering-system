import { Link } from 'react-router-dom';
import { LogOut, RefreshCw, Check, X, DollarSign, Clock, Plus, Receipt, ArrowRight } from 'lucide-react';
import { BILL_STATUS_LABELS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString('vi-VN')}d`;

const canAdvanceStatus = (status) => status > 0 && status < 6;

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

export default function AdminDashboardView({
  bills,
  billingSummary,
  isLoading,
  selectedBill,
  billDetails,
  isLoadingDetails,
  savingBillId,
  billStatusOptions,
  onRefresh,
  onLogout,
  onViewBill,
  onCloseBill,
  onNextStatus,
  onSetStatus,
  onSetPaid,
}) {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-brown-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-brown-300 mt-1">Manage bills, payments, and delivery progress</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dishes"
                className="flex items-center gap-2 px-4 py-2 bg-brown-800 rounded-lg hover:bg-brown-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Dish
              </Link>
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-brown-800 rounded-lg hover:bg-brown-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={onLogout}
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
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <BillingMetric
            icon={Receipt}
            label="Total Bills"
            value={billingSummary?.totalBills ?? bills.length}
          />
          <BillingMetric
            icon={DollarSign}
            label="Total Revenue"
            value={formatCurrency(billingSummary?.totalRevenue)}
          />
          <BillingMetric
            icon={Check}
            label="Paid Revenue"
            value={formatCurrency(billingSummary?.paidRevenue)}
            tone="success"
          />
          <BillingMetric
            icon={Clock}
            label="Amount Due"
            value={formatCurrency(billingSummary?.unpaidRevenue)}
            tone="warning"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="xl" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-brown-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Bill ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-100">
                      {bills.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-brown-500">
                            No bills found
                          </td>
                        </tr>
                      ) : (
                        bills.map((bill) => (
                          <tr key={bill.bill_id} className="hover:bg-cream/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-brown-900">#{bill.bill_id}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-brown-900">{bill.bill_phone}</p>
                              <p className="text-sm text-brown-500 truncate max-w-[150px]">{bill.bill_address}</p>
                            </td>
                            <td className="px-4 py-3 font-semibold text-primary">${bill.bill_total}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.bill_status)}`}>
                                  {BILL_STATUS_LABELS[bill.bill_status] || 'Unknown'}
                                </span>
                                {canAdvanceStatus(bill.bill_status) && (
                                  <button
                                    type="button"
                                    onClick={() => onNextStatus(bill)}
                                    disabled={savingBillId === bill.bill_id}
                                    title={`Move to ${BILL_STATUS_LABELS[bill.bill_status + 1]}`}
                                    aria-label={`Move bill #${bill.bill_id} to ${BILL_STATUS_LABELS[bill.bill_status + 1]}`}
                                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-success/30 text-success hover:bg-success/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {savingBillId === bill.bill_id ? (
                                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                              {bill.bill_paid === 'true' && (
                                <span className="ml-2 inline-flex items-center gap-1 text-xs text-success">
                                  <DollarSign className="w-3 h-3" />
                                  Paid
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => onViewBill(bill)}
                                  className="text-sm text-primary hover:underline"
                                >
                                  View Details
                                </button>
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

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                {selectedBill ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg text-brown-900">Bill #{selectedBill.bill_id}</h3>
                      <button
                        onClick={onCloseBill}
                        className="p-1 hover:bg-brown-100 rounded"
                      >
                        <X className="w-5 h-5 text-brown-400" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brown-400" />
                        <span className="text-sm text-brown-600">{selectedBill.bill_when}</span>
                      </div>
                      <div>
                        <span className="text-sm text-brown-500">Address:</span>
                        <p className="text-brown-900">{selectedBill.bill_address}</p>
                      </div>
                      <div>
                        <span className="text-sm text-brown-500">Phone:</span>
                        <p className="text-brown-900">{selectedBill.bill_phone}</p>
                      </div>
                    </div>

                    <div className="border-t border-brown-100 pt-4 mb-6">
                      <h4 className="font-semibold text-brown-900 mb-3">Bill & Payment State</h4>
                      <div className="grid gap-3">
                        <label className="block">
                          <span className="block text-sm text-brown-500 mb-1">Bill status</span>
                          <select
                            value={selectedBill.bill_status}
                            onChange={(event) =>
                              onSetStatus(selectedBill.bill_id, event.target.value)
                            }
                            disabled={savingBillId === selectedBill.bill_id}
                            className="input-field"
                          >
                            {billStatusOptions.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="block text-sm text-brown-500 mb-1">Payment state</span>
                          <select
                            value={selectedBill.bill_paid === 'true' ? 'paid' : 'unpaid'}
                            onChange={(event) =>
                              onSetPaid(selectedBill.bill_id, event.target.value)
                            }
                            disabled={savingBillId === selectedBill.bill_id}
                            className="input-field"
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                          </select>
                        </label>

                        {savingBillId === selectedBill.bill_id && (
                          <p className="text-sm text-brown-500">Saving bill state...</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-brown-100 pt-4">
                      <h4 className="font-semibold text-brown-900 mb-3">Items</h4>
                      {isLoadingDetails ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <ul className="space-y-2">
                          {billDetails.map((item, index) => (
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
                        <span className="text-brown-900">${selectedBill.bill_total - selectedBill.bill_delivery}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brown-500">Discount</span>
                        <span className="text-success">-${selectedBill.bill_discount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brown-500">Delivery</span>
                        <span className="text-brown-900">${selectedBill.bill_delivery}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-brown-100">
                        <span>Total</span>
                        <span className="text-primary">${selectedBill.bill_total}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-brown-500">
                    <p>Select a bill to view details</p>
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

function BillingMetric({ icon: Icon, label, value, tone = 'default' }) {
  const toneClass = {
    default: 'text-brown-900',
    success: 'text-success',
    warning: 'text-warning',
  }[tone];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-brown-500">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
