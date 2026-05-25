import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Calendar, Eye, EyeOff, AlertCircle, CheckCircle, ChefHat } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      await register(userData);
      setSuccess(true);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      if (error?.response?.status === 409) {
        const message = error.response.data?.message || 'An account already exists';
        setErrors(message.toLowerCase().includes('name') ? { name: message } : { email: message });
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-cream min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-brown-900 mb-4">Registration Successful!</h2>
          <p className="text-brown-600 mb-6">Redirecting you to home page...</p>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <ChefHat className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold heading-display">
              Q<span className="text-primary">Food</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-brown-900">Create Your Account</h1>
          <p className="text-brown-500 mt-2">Join QFood and start ordering</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input-field pl-12 ${errors.name ? 'border-error' : ''}`}
                />
              </div>
              {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-12 ${errors.email ? 'border-error' : ''}`}
                />
              </div>
              {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password & Confirm */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={`input-field pl-12 pr-12 ${errors.password ? 'border-error' : ''}`}
                  />
                </div>
                {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`input-field pl-12 ${errors.confirmPassword ? 'border-error' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-primary hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'} passwords
            </button>

            {errors.submit && (
              <div className="p-4 bg-error/10 text-error rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-brown-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-brown-500 hover:text-primary text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
