import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
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
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDishesPage from './pages/AdminDishesPage';
import BillingPage from './pages/BillingPage';
import ReceiptPage from './pages/ReceiptPage';
import ShipperLoginPage from './pages/ShipperLoginPage';
import ShipperDashboardPage from './pages/ShipperDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public routes with layout */}
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/dishes" element={<AdminDishesPage />} />

            {/* Shipper routes */}
            <Route path="/shipper" element={<ShipperLoginPage />} />
            <Route path="/shipper/dashboard" element={<ShipperDashboardPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
