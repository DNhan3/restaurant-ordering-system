import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    setName(user.user_name || '');
    setEmail(user.user_email || '');
  }, [isAuthenticated, navigate, user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();

    setProfileLoading(true);
    setProfileMessage(null);
    try {
      const resp = await userService.updateProfile(user.user_id, { name });
      const updatedUser = resp?.user ?? resp;
      updateUser(updatedUser);
      setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setIsEditingProfile(false);
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!currentPassword) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    if (!newPassword) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }
    if (newPassword === currentPassword) {
      errors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    setPasswordMessage(null);
    try {
      await userService.changePassword(user.user_id, currentPassword, newPassword);
      setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({});
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const roleLabel = {
    customer: 'Khách hàng',
    shipper: 'Shipper',
    admin: 'Quản trị viên',
  }[user?.role] || 'Khách hàng';

  const roleBgColor = {
    customer: 'bg-blue-100 text-blue-700',
    shipper: 'bg-green-100 text-green-700',
    admin: 'bg-purple-100 text-purple-700',
  }[user?.role] || 'bg-blue-100 text-blue-700';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-brown-900 mb-8">Hồ Sơ Cá Nhân</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center sticky top-28">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-brown-900">{name || 'Người dùng'}</h2>
              <p className="text-sm text-brown-500 mt-1">{email}</p>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${roleBgColor}`}>
                {roleLabel}
              </span>

              <div className="mt-6 pt-6 border-t border-brown-100 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-brown-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Personal Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-brown-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Thông Tin Cá Nhân
                </h3>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="text-sm text-primary hover:text-orange-700 font-medium transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">Họ tên</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-2.5 border border-brown-200 rounded-lg bg-brown-50 focus:ring-2 focus:ring-primary focus:border-transparent disabled:text-brown-700 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-2.5 border border-brown-200 rounded-lg bg-brown-100 text-brown-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-brown-400 mt-1">Email không thể thay đổi</p>
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-3 mt-5 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setName(user.user_name || '');
                      }}
                      className="px-5 py-2 border border-brown-200 rounded-lg text-brown-700 hover:bg-brown-50 transition-colors font-medium"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-60"
                    >
                      {profileLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Lưu
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Section 2: Change Password */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-brown-900 flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                Đổi Mật Khẩu
              </h3>

              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ít nhất 6 ký tự"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600"
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex mt-5 justify-end">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-60"
                  >
                    {passwordLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Toast Messages */}
        {profileMessage && (
          <div
            className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg z-50 animate-slide-up ${
              profileMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {profileMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{profileMessage.text}</span>
          </div>
        )}

        {passwordMessage && (
          <div
            className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg z-50 animate-slide-up ${
              passwordMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {passwordMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{passwordMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
