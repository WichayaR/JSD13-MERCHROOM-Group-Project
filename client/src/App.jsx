// ไฟล์: client/src/App.jsx
// ศูนย์รวม Routing และ Global State ทั้งหมดของเว็บไซต์
// เรียกมาจาก: client/src/main.jsx
// นำเข้าหน้าเว็บจาก: โฟลเดอร์ client/pages/* เพื่อแมป path URL
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/ui/Layout';
import Home from '../pages/Home';
import About from '../pages/AboutUS';
import Contact from '../pages/Contact';
import News from '../pages/News';
import Products from '../pages/Product';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import ThaiHeritage from '../pages/ThaiHeritage';
import PopCulture from '../pages/PopCulture';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgetPassword from '../pages/ForgetPassword';
import User from '../pages/User';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AccountLayout from '../pages/Account/AccountLayout';
import ProfileSettings from '../pages/Account/ProfileSettings';
import OrderHistory from '../pages/Account/OrderHistory';
import OrderDetail from '../pages/Account/OrderDetail';
import Wishlist from '../pages/Account/Wishlist';
import PaymentMethods from '../pages/Account/PaymentMethods';

// รวม Route ทั้งหมดของเว็บไว้ที่นี่
export default function App() {
  return (
    // ครอบ Auth กับ Cart ไว้ชั้นนอกสุด เพื่อให้ทุกหน้าดึงสถานะ user และจัดการตะกร้าได้ทั่วถึง
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout ตัวหลัก (ครอบ Navbar + Footer) ส่วนเนื้อหาแต่ละหน้าจะ render ใน Outlet */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="news" element={<News />} />
              <Route path="products" element={<Products />} />

              {/* Dynamic route: รับ productId เพื่อไปดึงข้อมูลสินค้าชิ้นนั้น */}
              <Route path="productDetail/:productId" element={<ProductDetail />} />

              <Route path="cart" element={<Cart />} />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* Dynamic route: รับ orderId เพื่อดึงใบเสร็จคำสั่งซื้อมาแสดง */}
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />

              <Route path="thai-heritage" element={<ThaiHeritage />} />
              <Route path="pop-culture" element={<PopCulture />} />

              <Route
                path="user"
                element={
                  <ProtectedRoute>
                    <User />
                  </ProtectedRoute>
                }
              />
              <Route
                path="user/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* หน้าประวัติคำสั่งซื้อ (Order History)*/}
              <Route path="order-history" element={<OrderHistory />} />
              <Route path="account/orders" element={<OrderHistory />} />
              <Route path="account/orders/:orderId" element={<OrderDetail />} />

              {/* Account pages — ใช้ AccountLayout เป็น parent (มี Sidebar) */}
              <Route
                path="account"
                element={
                  <ProtectedRoute>
                    <AccountLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ProfileSettings />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="payment-methods" element={<PaymentMethods />} />
              </Route>
            </Route>

            {/* หน้าระบบสมาชิกวางนอก Layout */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgetPassword />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
