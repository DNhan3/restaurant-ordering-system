import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function TableBookingPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: user?.user_name || '',
    phone: user?.user_phone || '',
    people: '',
    tables: '1',
    card: '',
    when: '',
    note: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.replace(/\s/g, ''))) {
      newErrors.name = 'Name can only contain letters';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!formData.phone.startsWith('84') || formData.phone.length !== 11) {
      newErrors.phone = 'Phone must start with 84 and be 11 digits';
    }

    if (!formData.people) {
      newErrors.people = 'Number of people is required';
    } else if (parseInt(formData.people) < 1 || parseInt(formData.people) > 100) {
      newErrors.people = 'Number of people must be between 1 and 100';
    }

    if (!formData.tables) {
      newErrors.tables = 'Number of tables is required';
    } else if (parseInt(formData.tables) < 1 || parseInt(formData.tables) > 50) {
      newErrors.tables = 'Number of tables must be between 1 and 50';
    }

    if (formData.card && (formData.card.length !== 10 || !/^\d+$/.test(formData.card))) {
      newErrors.card = 'Card number must be 10 digits';
    }

    if (!formData.when) {
      newErrors.when = 'Date and time is required';
    } else {
      const selectedDate = new Date(formData.when);
      const now = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);

      if (selectedDate < now) {
        newErrors.when = 'Cannot book in the past';
      } else if (selectedDate > maxDate) {
        newErrors.when = 'Can only book up to 3 months in advance';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        book_name: formData.name,
        book_phone: parseInt(formData.phone),
        book_people: parseInt(formData.people),
        book_tables: parseInt(formData.tables),
        user_id: formData.card ? parseInt(formData.card) : null,
        book_when: formData.when,
        book_note: formData.note,
      };

      await bookingService.create(bookingData);
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        people: '',
        tables: '1',
        card: '',
        when: '',
        note: '',
      });
    } catch (error) {
      console.error('Booking failed:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book a Table</h1>
          <p className="text-white/80">
            Reserve your spot for a memorable dining experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-brown-900 mb-4">
                    Booking Submitted!
                  </h2>
                  <p className="text-brown-600 mb-6">
                    Thank you for your reservation. We'll contact you shortly to confirm your booking.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-primary"
                  >
                    Make Another Booking
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-brown-900 mb-6">
                    Reservation Details
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-2">
                        Your Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`input-field ${errors.name ? 'border-error' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-error text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-2">
                        Phone Number <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="84123456789"
                        className={`input-field ${errors.phone ? 'border-error' : ''}`}
                      />
                      {errors.phone && (
                        <p className="text-error text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Number of People */}
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-2">
                        Number of People <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        name="people"
                        value={formData.people}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        placeholder="2"
                        className={`input-field ${errors.people ? 'border-error' : ''}`}
                      />
                      {errors.people && (
                        <p className="text-error text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.people}
                        </p>
                      )}
                    </div>

                    {/* Number of Tables */}
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-2">
                        Number of Tables <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        name="tables"
                        value={formData.tables}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        placeholder="1"
                        className={`input-field ${errors.tables ? 'border-error' : ''}`}
                      />
                      {errors.tables && (
                        <p className="text-error text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.tables}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Date & Time <span className="text-error">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="when"
                      value={formData.when}
                      onChange={handleChange}
                      className={`input-field ${errors.when ? 'border-error' : ''}`}
                    />
                    {errors.when && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.when}
                      </p>
                    )}
                  </div>

                  {/* Membership Card */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Membership Card (Optional)
                    </label>
                    <input
                      type="text"
                      name="card"
                      value={formData.card}
                      onChange={handleChange}
                      placeholder="1234567890"
                      maxLength={10}
                      className={`input-field ${errors.card ? 'border-error' : ''}`}
                    />
                    {errors.card && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.card}
                      </p>
                    )}
                    <p className="text-xs text-brown-500 mt-1">
                      Enter your membership card number for exclusive benefits
                    </p>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Any special requests or dietary requirements..."
                      className="input-field resize-none"
                    />
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-error/10 text-error rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {errors.submit}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        Confirm Reservation
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-lg text-brown-900 mb-4">Restaurant Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brown-900">Address</p>
                    <p className="text-sm text-brown-500">
                      02 Duong Khue, Cau Giay, Ha Noi, Viet Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brown-900">Phone</p>
                    <a href="tel:+84123123123" className="text-sm text-primary hover:underline">
                      +84 123 123 123
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brown-900">Opening Hours</p>
                    <p className="text-sm text-brown-500">
                      Everyday: 7:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Tips */}
            <div className="bg-cream rounded-2xl p-6">
              <h3 className="font-bold text-lg text-brown-900 mb-4">Booking Tips</h3>
              <ul className="space-y-3">
                {[
                  'Book at least 24 hours in advance',
                  'For large groups (20+), call us directly',
                  'Tables are held for 15 minutes past reservation time',
                  'Cancellations must be made 2 hours before',
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-brown-600">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Booking CTA */}
            <div className="bg-primary/10 rounded-2xl p-6 text-center">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-brown-900 mb-2">Planning a Group Event?</h3>
              <p className="text-sm text-brown-600 mb-4">
                We offer special packages for parties and corporate events.
              </p>
              <a href="tel:+84123123123" className="btn-primary inline-flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
