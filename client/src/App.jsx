import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from '../pages/Home';
import About from '../pages/AboutUS';
import Contact from '../pages/Contact';
import Products from '../pages/Product';
import ProductDetail from '../pages/ProductDetail';
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
            <Route path="products" element={<Products />} />
            <Route path="productDetail/:productId" element={<ProductDetail />} />
            <Route path="thai-heritage" element={<ThaiHeritage />} />
            <Route path="pop-culture" element={<PopCulture />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
