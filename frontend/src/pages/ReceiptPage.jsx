import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CalendarClock,
  CheckCircle,
  CreditCard,
  MapPin,
  Phone,
  Receipt,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { billingService } from '../services/api';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString('vi-VN')}d`;

const getPaymentIcon = (method) =>
  method === 'card' ? CreditCard : Banknote;

export default function ReceiptPage() {
  const { billId } = useParams();
  const { user } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    loadInvoices();
  }, [user, billId]);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await billingService.getUserInvoices(user.user_id);

      const invoiceFromRoute = billId
        ? data.find((invoice) => String(invoice.bill_id) === String(billId))
        : null;

      if (invoiceFromRoute) {
        setSelectedInvoice(invoiceFromRoute);
      } else if (billId) {
        setSelectedInvoice(null);
        setError('This receipt is not available for your account.');
      } else {
        setSelectedInvoice(data[0] ?? null);
      }
    } catch (err) {
      console.error('Failed to load receipt:', err);
      setError('Unable to load receipt information.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-brown-900 mb-4">Please Login</h2>
          <p className="text-brown-500 mb-6">You need to login to view receipts.</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!billId) {
    return <Navigate to="/billing" replace />;
  }

  if (isLoading) {
    return (
      <div className="bg-cream min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cream min-h-screen px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 text-error flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!selectedInvoice) {
    return (
      <div className="bg-cream min-h-screen">
        <EmptyState
          icon={Receipt}
          title="Receipt not found"
          description="Open receipts from billing so we can show the matching checkout."
          actionLabel="View Billing"
          actionTo="/billing"
        />
      </div>
    );
  }

  const PaymentIcon = selectedInvoice
    ? getPaymentIcon(selectedInvoice.bill_payment_method)
    : Receipt;

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-brown-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/billing"
            className="inline-flex items-center gap-2 text-white/75 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to billing
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Receipt</h1>
          <p className="text-white/75">Receipt and payment details for one order.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2">
                  <Receipt className="w-5 h-5" />
                  Order #{selectedInvoice.bill_id} Receipt
                </div>
                <h2 className="text-2xl font-bold text-brown-900">
                  {formatCurrency(selectedInvoice.bill_total)}
                </h2>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                  selectedInvoice.bill_paid
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                }`}
              >
                {selectedInvoice.bill_paid ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {selectedInvoice.bill_paid ? 'Paid' : 'Payment due'}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
                  <InvoiceMeta
                    icon={CalendarClock}
                    label="Created"
                    value={new Date(selectedInvoice.bill_when).toLocaleString()}
                  />
                  <InvoiceMeta
                    icon={PaymentIcon}
                    label="Payment"
                    value={
                      selectedInvoice.bill_payment_method === 'card'
                        ? 'Card'
                        : 'Cash'
                    }
                  />
                  <InvoiceMeta
                    icon={Phone}
                    label="Phone"
                    value={selectedInvoice.bill_phone || '-'}
                  />
                  <InvoiceMeta
                    icon={MapPin}
                    label="Delivery"
                    value={selectedInvoice.bill_address || '-'}
                  />
            </div>

            <div className="border border-brown-100 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[1fr_72px_120px] gap-3 bg-brown-100 px-4 py-3 text-sm font-semibold text-brown-900">
                    <span>Item</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Total</span>
                  </div>
                  {selectedInvoice.bill_details.map((item) => (
                    <div
                      key={item.bill_detail_id}
                      className="grid grid-cols-[1fr_72px_120px] gap-3 px-4 py-3 border-t border-brown-100 text-sm"
                    >
                      <div>
                        <p className="font-medium text-brown-900">
                          {item.food?.food_name || `Item #${item.food_id}`}
                        </p>
                        <p className="text-brown-500">
                          {formatCurrency(item.item_price)}
                        </p>
                      </div>
                      <span className="text-center text-brown-700">
                        {item.item_qty}
                      </span>
                      <span className="text-right font-semibold text-brown-900">
                        {formatCurrency(item.line_total)}
                      </span>
                    </div>
                  ))}
            </div>

            <div className="mt-6 ml-auto max-w-sm space-y-3">
                  <InvoiceTotal label="Subtotal" value={selectedInvoice.bill_subtotal} />
                  <InvoiceTotal
                    label="Discount"
                    value={-Number(selectedInvoice.bill_discount || 0)}
                    tone="success"
                  />
                  <InvoiceTotal label="Delivery" value={selectedInvoice.bill_delivery} />
                  <div className="border-t border-brown-100 pt-3">
                    <InvoiceTotal
                      label="Amount due"
                      value={selectedInvoice.bill_amount_due}
                      strong
                    />
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceMeta({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-cream rounded-xl p-3">
      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-brown-500">{label}</p>
        <p className="font-medium text-brown-900 break-words">{value}</p>
      </div>
    </div>
  );
}

function InvoiceTotal({ label, value, tone = 'default', strong = false }) {
  const toneClass = {
    default: 'text-brown-900',
    success: 'text-success',
    error: 'text-error',
  }[tone];

  return (
    <div className={`flex justify-between ${strong ? 'text-lg font-bold' : 'text-sm'}`}>
      <span className="text-brown-500">{label}</span>
      <span className={toneClass}>{formatCurrency(value)}</span>
    </div>
  );
}
