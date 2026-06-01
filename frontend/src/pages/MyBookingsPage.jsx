import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, Phone, Users, Utensils, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/api';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const data = await bookingService.getByUser(user.user_id);
        setBookings(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(`Cancel booking #${booking.id}?`);
    if (!confirmed) return;

    try {
      setMessage('');
      setCancelingId(booking.id);
      await bookingService.cancel(booking.id);
      setBookings((current) => current.filter((item) => item.id !== booking.id));
      setMessage('Booking canceled.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to cancel booking.');
    } finally {
      setCancelingId(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-brown-900 mb-4">Vui lòng đăng nhập</h2>
          <Link to="/login" className="btn-primary">Đăng nhập</Link>
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

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Lịch Đặt Bàn</h1>
          <p className="text-white/80">Theo dõi các bàn bạn đã đặt tại nhà hàng.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-4 rounded-xl bg-white px-4 py-3 text-sm text-brown-700 shadow-sm">
            {message}
          </div>
        )}
        {bookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Chưa có lịch đặt bàn"
            description="Các lịch đặt bàn của bạn sẽ hiển thị tại đây."
            actionLabel="Đặt Bàn"
            actionTo="/table-booking"
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-brown-900">Booking #{booking.id}</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-brown-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {booking.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {booking.people} people
                      </span>
                      <span className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-primary" />
                        {booking.tables} table(s)
                      </span>
                      <span className="flex items-center gap-2 sm:col-span-2">
                        <Phone className="w-4 h-4 text-primary" />
                        {booking.phone}
                      </span>
                    </div>
                    {booking.note && (
                      <p className="mt-3 text-sm text-brown-500">{booking.note}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 md:min-w-32">
                    <Link to="/table-booking" className="btn-primary text-center">
                      Đặt thêm
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCancel(booking)}
                      disabled={cancelingId === booking.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" />
                      {cancelingId === booking.id ? 'Canceling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
