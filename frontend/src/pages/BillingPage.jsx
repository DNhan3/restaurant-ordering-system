import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { billingService } from '../services/api';
import BillingView from '../views/BillingView';

export default function BillingPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBill, setExpandedBill] = useState(null);
  const [billDetails, setBillDetails] = useState({});
  const [cancelingBillId, setCancelingBillId] = useState(null);

  const loadBills = useCallback(async () => {
    await Promise.resolve();

    if (!user) {
      setBills([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await billingService.getUserBills(user.user_id);
      setBills(data);
    } catch (error) {
      console.error('Failed to load bills:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBills();
  }, [loadBills]);

  const loadBillDetails = async (billId) => {
    if (billDetails[billId]) return;

    try {
      const details = await billingService.getBillDetails(billId);
      setBillDetails((prev) => ({ ...prev, [billId]: details }));
    } catch (error) {
      console.error('Failed to load bill details:', error);
    }
  };

  const handleToggleBillDetails = async (bill) => {
    if (expandedBill === bill.bill_id) {
      setExpandedBill(null);
      return;
    }

    setExpandedBill(bill.bill_id);
    await loadBillDetails(bill.bill_id);
  };

  const handleCancelBill = async (event, bill) => {
    event.stopPropagation();

    const shouldCancel = window.confirm(`Cancel bill #${bill.bill_id}?`);
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

  return (
    <BillingView
      user={user}
      bills={bills}
      isLoading={isLoading}
      expandedBill={expandedBill}
      billDetails={billDetails}
      cancelingBillId={cancelingBillId}
      onToggleBillDetails={handleToggleBillDetails}
      onCancelBill={handleCancelBill}
    />
  );
}
