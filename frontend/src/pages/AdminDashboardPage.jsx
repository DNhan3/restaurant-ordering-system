import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { billingService } from '../services/api';
import { BILL_STATUS_LABELS } from '../utils/constants';
import AdminDashboardView from '../views/AdminDashboardView';

const BILL_STATUS_OPTIONS = [
  { value: 0, label: BILL_STATUS_LABELS[0], apiStatus: 'cancelled' },
  { value: 1, label: BILL_STATUS_LABELS[1], apiStatus: 'confirmed' },
  { value: 2, label: BILL_STATUS_LABELS[2], apiStatus: 'preparing' },
  { value: 3, label: BILL_STATUS_LABELS[3], apiStatus: 'checking' },
  { value: 4, label: BILL_STATUS_LABELS[4], apiStatus: 'delivering' },
  { value: 5, label: BILL_STATUS_LABELS[5], apiStatus: 'delivered' },
  { value: 6, label: BILL_STATUS_LABELS[6], apiStatus: 'completed' },
];

export default function AdminDashboardPage() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billDetails, setBillDetails] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [savingBillId, setSavingBillId] = useState(null);

  const loadBills = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await billingService.getAllBills();
      setBills(data);
    } catch (error) {
      console.error('Failed to load bills:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadBillingSummary = useCallback(async () => {
    try {
      const summary = await billingService.getSummary();
      setBillingSummary(summary);
    } catch (error) {
      console.error('Failed to load billing summary:', error);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    await Promise.all([loadBills(), loadBillingSummary()]);
  }, [loadBills, loadBillingSummary]);

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshDashboard();
  }, [admin, navigate, refreshDashboard]);

  const loadBillDetails = async (billId) => {
    try {
      setIsLoadingDetails(true);
      const details = await billingService.getBillDetails(billId);
      setBillDetails(details);
    } catch (error) {
      console.error('Failed to load bill details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleViewBill = async (bill) => {
    setSelectedBill(bill);
    await loadBillDetails(bill.bill_id);
  };

  const handleCloseBill = () => {
    setSelectedBill(null);
    setBillDetails([]);
  };

  const updateBill = async (billId, data) => {
    setSavingBillId(billId);
    try {
      const updated = await billingService.updateBill(billId, data);
      setBills((prev) =>
        prev.map((bill) => (bill.bill_id === billId ? updated : bill)),
      );
      setSelectedBill((current) =>
        current?.bill_id === billId ? updated : current,
      );
      await loadBillingSummary();
      return updated;
    } finally {
      setSavingBillId(null);
    }
  };

  const handleNextStatus = async (bill) => {
    const nextOption = BILL_STATUS_OPTIONS.find(
      (status) => status.value === bill.bill_status + 1,
    );

    if (!nextOption) return;

    try {
      await updateBill(bill.bill_id, { status: nextOption.apiStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSetStatus = async (billId, statusValue) => {
    const option = BILL_STATUS_OPTIONS.find(
      (status) => status.value === Number(statusValue),
    );

    if (!option) return;

    try {
      await updateBill(billId, { status: option.apiStatus });
    } catch (error) {
      console.error('Failed to set bill status:', error);
    }
  };

  const handleSetPaid = async (billId, paidValue) => {
    try {
      await updateBill(billId, { paid: paidValue === 'paid' });
    } catch (error) {
      console.error('Failed to set payment state:', error);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  if (!admin) {
    return null;
  }

  return (
    <AdminDashboardView
      bills={bills}
      billingSummary={billingSummary}
      isLoading={isLoading}
      selectedBill={selectedBill}
      billDetails={billDetails}
      isLoadingDetails={isLoadingDetails}
      savingBillId={savingBillId}
      billStatusOptions={BILL_STATUS_OPTIONS}
      onRefresh={refreshDashboard}
      onLogout={handleLogout}
      onViewBill={handleViewBill}
      onCloseBill={handleCloseBill}
      onNextStatus={handleNextStatus}
      onSetStatus={handleSetStatus}
      onSetPaid={handleSetPaid}
    />
  );
}
