import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const SEATS_PER_TABLE = 4;
const calculateTables = (people) => {
  const peopleCount = Number(people);
  if (!Number.isInteger(peopleCount) || peopleCount < 1) return '1';
  return String(Math.ceil(peopleCount / SEATS_PER_TABLE));
};

export default function TableBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.user_name || '',
    phone: user?.user_phone || '',
    people: '',
    tables: '1',
    when: '',
    note: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'people' ? { tables: calculateTables(value) } : {}),
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [formData.when, formData.tables]);

  const checkAvailability = async () => {
    if (!formData.when) {
      setAvailability(null);
      return null;
    }

    const [date, timeWithSeconds] = formData.when.split('T');
    const time = timeWithSeconds?.slice(0, 5);

    if (!date || !time) {
      setAvailability(null);
      return null;
    }

    try {
      setIsCheckingAvailability(true);
      const data = await bookingService.getAvailability({ date, time });
      setAvailability(data);
      return data;
    } catch {
      setAvailability(null);
      return null;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Vui lòng nhập tên';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.replace(/\s/g, ''))) {
      newErrors.name = 'Tên chỉ được chứa chữ cái';
    }

    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!formData.phone.startsWith('0') || formData.phone.length !== 10) {
      newErrors.phone = 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số';
    }

    if (!formData.people) {
      newErrors.people = 'Vui lòng nhập số lượng người';
    } else if (parseInt(formData.people) < 1 || parseInt(formData.people) > 100) {
      newErrors.people = 'Số lượng người phải từ 1 đến 100';
    }

    if (!formData.tables) {
      newErrors.tables = 'Vui lòng nhập số lượng bàn';
    } else if (parseInt(formData.tables) < 1 || parseInt(formData.tables) > 50) {
      newErrors.tables = 'Số lượng bàn phải từ 1 đến 50';
    }

    if (!formData.when) {
      newErrors.when = 'Vui lòng chọn ngày và giờ';
    } else {
      const selectedDate = new Date(formData.when);
      const now = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);

      if (selectedDate < now) {
        newErrors.when = 'Không thể đặt bàn trong quá khứ';
      } else if (selectedDate > maxDate) {
        newErrors.when = 'Chỉ có thể đặt trước 3 tháng';
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
      const latestAvailability = await checkAvailability();
      if (
        latestAvailability &&
        parseInt(formData.tables) > latestAvailability.availableTables
      ) {
        setErrors({
          submit: `Only ${latestAvailability.availableTables} table(s) available for this time.`,
        });
        return;
      }

      const bookingData = {
        book_name: formData.name,
        book_phone: parseInt(formData.phone),
        book_people: parseInt(formData.people),
        book_tables: parseInt(formData.tables),
        user_id: user?.user_id || null,
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
        when: '',
        note: '',
      });
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Gửi đặt bàn thất bại. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Đặt Bàn</h1>
          <p className="text-white/80">
            Đặt chỗ cho trải nghiệm ẩm thực đáng nhớ
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
                    Đặt Bàn Thành Công!
                  </h2>
                  <p className="text-brown-600 mb-6">
                    Cảm ơn bạn đã đặt bàn. Chúng tôi sẽ liên hệ sớm để xác nhận.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-primary"
                  >
                    Đặt Bàn Khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-brown-900 mb-6">
                    Thông Tin Đặt Bàn
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-2">
                        Họ Tên <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
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
                        Số Điện Thoại <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
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
                        Số Người <span className="text-error">*</span>
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
                        Số Bàn <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        name="tables"
                        value={formData.tables}
                        readOnly
                        min="1"
                        max="50"
                        placeholder="1"
                        className={`input-field bg-brown-50 ${errors.tables ? 'border-error' : ''}`}
                      />
                      <p className="mt-1 text-xs text-brown-500">Auto-calculated from people ({SEATS_PER_TABLE} seats per table).</p>
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
                      Ngày & Giờ <span className="text-error">*</span>
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
                    {formData.when && (
                      <div className={`mt-3 rounded-xl px-4 py-3 text-sm ${
                        availability && parseInt(formData.tables || '0') > availability.availableTables
                          ? 'bg-error/10 text-error'
                          : 'bg-success/10 text-success'
                      }`}>
                        {isCheckingAvailability
                          ? 'Checking table availability...'
                          : availability
                            ? `${availability.availableTables} of ${availability.totalTables} table(s) available for this time.`
                            : 'Availability could not be checked.'}
                      </div>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Yêu Cầu Đặc Biệt (Tùy Chọn)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Yêu cầu về dịp đặc biệt hoặc chế độ ăn..."
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
                    disabled={
                      isSubmitting ||
                      (availability && parseInt(formData.tables || '0') > availability.availableTables)
                    }
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang Xử Lý...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        Xác Nhận Đặt Bàn
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
              <h3 className="font-bold text-lg text-brown-900 mb-4">Thông Tin Nhà Hàng</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brown-900">Địa Chỉ</p>
                    <p className="text-sm text-brown-500">
                      36 Phố Nông, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brown-900">Điện Thoại</p>
                    <a href="tel:+84123456789" className="text-sm text-primary hover:underline">
                      +84 123 456 789
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brown-900">Giờ Mở Cửa</p>
                    <p className="text-sm text-brown-500">
                      Mỗi ngày: 7:00 - 22:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Tips */}
            <div className="bg-cream rounded-2xl p-6">
              <h3 className="font-bold text-lg text-brown-900 mb-4">Mẹo Đặt Bàn</h3>
              <ul className="space-y-3">
                {[
                  'Đặt trước ít nhất 24 giờ',
                  'Nhóm đông (20+ người) vui lòng gọi điện',
                  'Bàn giữ 15 phút sau giờ đặt',
                  'Hủy đặt bàn trước 2 giờ',
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
              <h3 className="font-bold text-brown-900 mb-2">Tổ Chức Sự Kiện?</h3>
              <p className="text-sm text-brown-600 mb-4">
                Chúng tôi có gói đặc biệt cho tiệc và sự kiện công ty.
              </p>
              <a href="tel:+84123456789" className="btn-primary inline-flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Gọi Ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
