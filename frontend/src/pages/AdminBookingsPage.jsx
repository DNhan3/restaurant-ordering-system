import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarPlus, Edit, LogOut, Save, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/api';

const SEATS_PER_TABLE = 4;
const calculateTables = (people) => {
  const peopleCount = Number(people);
  if (!Number.isInteger(peopleCount) || peopleCount < 1) return '1';
  return String(Math.ceil(peopleCount / SEATS_PER_TABLE));
};

const initialForm = {
  book_name: '',
  book_phone: '',
  book_people: '',
  book_tables: '1',
  book_when: '',
  book_note: '',
};

const toDateTimeLocal = (booking) => {
  if (!booking?.date || !booking?.time) return '';
  return `${booking.date}T${booking.time}`;
};

export default function AdminBookingsPage() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }
    loadBookings();
  }, [admin, navigate]);

  const loadBookings = async () => {
    const data = await bookingService.getAll();
    setBookings(data);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingBookingId(null);
    setAvailability(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [form.book_when, form.book_tables, editingBookingId]);

  const buildPayload = () => ({
    book_name: form.book_name.trim(),
    book_phone: Number(form.book_phone),
    book_people: Number(form.book_people),
    book_tables: Number(form.book_tables),
    book_when: form.book_when,
    book_note: form.book_note.trim(),
    user_id: null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    try {
      const latestAvailability = await checkAvailability();
      if (
        latestAvailability &&
        Number(form.book_tables) > latestAvailability.availableTables
      ) {
        setMessage(
          `Only ${latestAvailability.availableTables} table(s) available for this time slot.`,
        );
        return;
      }

      if (editingBookingId) {
        await bookingService.update(editingBookingId, buildPayload());
        setMessage('Booking updated.');
      } else {
        await bookingService.create(buildPayload());
        setMessage('Booking created.');
      }

      resetForm();
      await loadBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save booking.');
    } finally {
      setIsSaving(false);
    }
  };

  const checkAvailability = async () => {
    if (!form.book_when) {
      setAvailability(null);
      return null;
    }

    const [date, timeWithSeconds] = form.book_when.split('T');
    const time = timeWithSeconds?.slice(0, 5);
    if (!date || !time) {
      setAvailability(null);
      return null;
    }

    try {
      setIsCheckingAvailability(true);
      const data = await bookingService.getAvailability({
        date,
        time,
        excludeId: editingBookingId,
      });
      setAvailability(data);
      return data;
    } catch (error) {
      setAvailability(null);
      return null;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleEdit = (booking) => {
    setEditingBookingId(booking.id);
    setForm({
      book_name: booking.name || '',
      book_phone: booking.phone || '',
      book_people: booking.people || '',
      book_tables: calculateTables(booking.people),
      book_when: toDateTimeLocal(booking),
      book_note: booking.note || '',
    });
    setMessage('');
  };

  const handleDelete = async (booking) => {
    const confirmed = window.confirm(`Delete booking for "${booking.name}"?`);
    if (!confirmed) return;

    try {
      await bookingService.remove(booking.id);
      if (editingBookingId === booking.id) resetForm();
      setMessage('Booking deleted.');
      await loadBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete booking.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  if (!admin) return null;

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-brown-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-white/75 hover:text-white mb-3">
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Booking Management</h1>
            <p className="text-brown-300 mt-1">Create, edit, and delete table bookings.</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-light">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-brown-900">{editingBookingId ? 'Edit Booking' : 'Create Booking'}</h2>
            {editingBookingId && (
              <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-brown-50">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <input className="input-field" type="text" placeholder="Customer name" value={form.book_name} onChange={(e) => setForm({ ...form, book_name: e.target.value })} required />
            <input className="input-field" type="tel" placeholder="Phone" value={form.book_phone} onChange={(e) => setForm({ ...form, book_phone: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" type="number" min="1" placeholder="People" value={form.book_people} onChange={(e) => setForm({ ...form, book_people: e.target.value, book_tables: calculateTables(e.target.value) })} required />
              <input className="input-field bg-brown-50" type="number" min="1" placeholder="Tables" value={form.book_tables} readOnly required />
            </div>
            <p className="-mt-2 text-xs text-brown-500">Tables are auto-calculated from people ({SEATS_PER_TABLE} seats per table).</p>
            <input className="input-field" type="datetime-local" value={form.book_when} onChange={(e) => setForm({ ...form, book_when: e.target.value })} required />
            {form.book_when && (
              <div className={`rounded-xl px-4 py-3 text-sm ${
                availability && Number(form.book_tables) > availability.availableTables
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                {isCheckingAvailability
                  ? 'Checking table availability...'
                  : availability
                    ? `${availability.availableTables} of ${availability.totalTables} table(s) available for this time slot.`
                    : 'Availability could not be checked.'}
              </div>
            )}
            <textarea className="input-field min-h-[96px]" placeholder="Note" value={form.book_note} onChange={(e) => setForm({ ...form, book_note: e.target.value })} />
            <button
              disabled={
                isSaving ||
                (availability && Number(form.book_tables) > availability.availableTables)
              }
              className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {editingBookingId ? <Save className="w-4 h-4" /> : <CalendarPlus className="w-4 h-4" />}
              {isSaving ? 'Saving...' : editingBookingId ? 'Update Booking' : 'Create Booking'}
            </button>
            {message && <p className="text-sm text-brown-600">{message}</p>}
          </div>
        </form>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brown-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">When</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Party</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-brown-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-cream/50">
                    <td className="px-4 py-3 text-sm text-brown-600">#{booking.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brown-900">{booking.name}</p>
                      <p className="text-sm text-brown-500">{booking.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-brown-600">{booking.date} {booking.time}</td>
                    <td className="px-4 py-3 text-sm text-brown-600">{booking.people} people, {booking.tables} tables</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(booking)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brown-200 text-brown-600 hover:bg-brown-50">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(booking)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
