import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Component } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PromotionsPage from './pages/PromotionsPage';
import MenuPage from './pages/MenuPage';
import TableBookingPage from './pages/TableBookingPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDishesPage from './pages/AdminDishesPage';
import BillingPage from './pages/BillingPage';
import ReceiptPage from './pages/ReceiptPage';
import ShipperDashboardPage from './pages/ShipperDashboardPage';
import { getDashboardPath } from './utils/authHelpers';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-brown-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/table-booking" element={<TableBookingPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/my-orders" element={<Navigate to="/billing" replace />} />
              <Route path="/orders/:billId/receipt" element={<ReceiptPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/billing/:billId" element={<ReceiptPage />} />
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dishes"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDishesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shipper/dashboard"
              element={
                <ProtectedRoute allowedRoles={['shipper']}>
                  <ShipperDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
