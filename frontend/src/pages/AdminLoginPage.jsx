import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ChefHat } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLoginPage() {
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await loginAsAdmin(password);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid admin password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <ChefHat className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold heading-display">
              Q<span className="text-primary">Food</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-brown-900">Admin Access</h1>
          <p className="text-brown-500 mt-2">Enter admin password to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={`input-field pl-12 ${error ? 'border-error' : ''}`}
                />
              </div>
              {error && (
                <p className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Checking...' : 'Access Admin Dashboard'}
            </button>
          </form>
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
