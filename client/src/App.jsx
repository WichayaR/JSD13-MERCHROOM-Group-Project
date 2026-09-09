
//1. ทำหน้าที่เปิดใช้งานระบบ Navigation โดยอิงจาก URL บน Browser ช่วยให้เปลี่ยนหน้าเว็บได้แบบ Single Page Application เปลี่ยนหน้าได้ทันทีโดยไม่ต้อง Refresh หน้าเว็บใหม่
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//2. ครอบแอปพลิเคชันด้วย CartProvider:การจัดการข้อมูลตะกร้าสินค้าแบบ Global State 
// ด้วยการส่ง <CartProvider> ไว้ที่ชั้นนอกสุด เพื่อให้ ทุกหน้า (Pages) และทุกคอมโพเนนต์ ที่อยู่ภายใน 
// สามารถเข้าถึงข้อมูลสินค้าในตะกร้า (Cart State) และฟังก์ชันต่าง ๆ (เช่น เพิ่ม/ลด สินค้า) ได้โดยไม่ต้องส่ง prop ลงไปหลาย ๆ ชั้น
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

//3. กําหนด Layout หลักด้วย Nested Routes:
// ใช้การสืบทอด โครงสร้างหน้าเว็บ (Header / Footer)
// ใช้ <Route element="{<Layout" path="/"/>}> เป็นตัวครอบหลัก 
// (Parent Route)หน้าต่าง ๆ ที่อยู่ภายในจะสืบทอดโครงสร้างของ <Layout/> 
// (เช่น มี Header และ Footer เหมือนกันทุกหน้า)
// เนื้อหาของแต่ละหน้าจะไปแสดงผลในจุดที่วาง <Outlet/> ไว้ภายในตัว <Layout/>

//4.จับคู่ URL Path กับหน้าเว็บ (Pages):Mapping Routes<Routes> 
// ทำหน้าที่จับคู่ URL บนแถบที่อยู่ของ Browser กับ React Component ดังนี้:index (/): 
// แสดงหน้า Home (หน้าแรก)about (/about): แสดงหน้า AboutUS (เกี่ยวกับเรา)contact (/contact): 
// แสดงหน้า Contact (ติดต่อเรา)news (/news): แสดงหน้า News (ข่าวสาร)products (/products): 
// แสดงหน้า Products (รายการสินค้าทั้งหมด)cart (/cart): แสดงหน้า Cart (ตะกร้าสินค้า)checkout (/checkout): 
// แสดงหน้า Checkout (ชำระเงิน)thai-heritage (/thai-heritage): แสดงหน้า ThaiHeritagepop-culture (/pop-culture): แสดงหน้า PopCulture

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
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';

//5. รับค่า Dynamic Parameters ผ่าน URL:Dynamic 
// Routingมี 2 เส้นทางที่รับค่าพารามิเตอร์แบบเปลี่ยนไปตามข้อมูล:productDetail/:
// productId: รับค่า ID ของสินค้า เช่น /productDetail/123 
// เพื่อนำ :productId ไปดึงข้อมูลรายละเอียดสินค้านั้น ๆ มาแสดง
// order-confirmation/:orderId: รับค่า ID ของออเดอร์ เช่น /order-confirmation/ORD-999 เพื่อนำไปแสดงใบยืนยันการสั่งซื้อ

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="news" element={<News />} />
              <Route path="products" element={<Products />} />
              <Route path="productDetail/:productId" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="thai-heritage" element={<ThaiHeritage />} />
              <Route path="pop-culture" element={<PopCulture />} />
              <Route path="login" element={<Login />} />
              <Route path="user/dashboard" element={<UserDashboard />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
