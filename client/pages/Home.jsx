import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../src/data/product';
import { useCart } from '../src/context/CartContext';
import heroBanner from '../assets/Banner/hero-banner.png';

export default function Home() {
  const { addToCart } = useCart();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div>
      <section
        className="relative w-full h-[calc(100vh-64px)] bg-no-repeat bg-cover bg-center flex items-end justify-center pb-10"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <Link
          to="/products"
          className="inline-block bg-lime-300 text-black px-8 py-3 rounded-md font-semibold hover:bg-lime-600 transition"
        >
          Shop Now
        </Link>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Featured Products</h2>
        <div className="relative max-w-6xl mx-auto px-6">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-10 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[260px] max-w-[260px] border p-4 rounded-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-teal-600 font-bold text-lg mb-3">
                    ฿{product.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={addToCart}
                  className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold hover:bg-orange-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
