// pages/Account/Wishlist.jsx
import React from 'react';

export default function Wishlist() {
  const wishlistItems = [
    {
      id: 'prod_1',
      title: 'THAILAND POP-HERITAGE ART TOY',
      price: 2990,
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="bg-white border border-ink shadow-card rounded-card p-6 sm:p-8">
      <h2 className="font-sans font-extrabold text-2xl tracking-tight text-ink uppercase mb-6">
        MY WISHLIST
      </h2>

      {wishlistItems.length === 0 ? (
        <p className="font-sans font-bold text-muted text-center py-8">YOUR WISHLIST IS EMPTY.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((prod) => (
            <div key={prod.id} className="border border-ink bg-cream rounded-card overflow-hidden flex flex-col">
              <img src={prod.imageUrl} alt={prod.title} className="w-full h-44 object-cover mix-blend-multiply" />
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h4 className="font-sans font-extrabold text-xs text-ink">{prod.title}</h4>
                <div className="font-sans font-extrabold text-sm text-ink">฿{prod.price.toLocaleString()}</div>
                <button className="mt-auto bg-primary text-white border border-ink font-sans font-extrabold text-xs py-2 rounded-btn hover:bg-primary-deep transition-all transform hover:-translate-y-0.5 cursor-pointer">
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}