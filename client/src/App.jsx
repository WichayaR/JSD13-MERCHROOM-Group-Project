import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/ui/Layout';
import Home from '../pages/Home';
import About from '../pages/AboutUS';
import Contact from '../pages/Contact';
import News from '../pages/News';
import Products from '../pages/Product';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import ThaiHeritage from '../pages/ThaiHeritage';
import PopCulture from '../pages/PopCulture';

export default function App() {
  return (
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
            <Route path="thai-heritage" element={<ThaiHeritage />} />
            <Route path="pop-culture" element={<PopCulture />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
