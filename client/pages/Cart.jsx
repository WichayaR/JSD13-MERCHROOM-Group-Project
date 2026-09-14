import { useState } from 'react';
import { ArrowRight, Minus, Plus, Trash2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';
import { PROMO_CODES } from '../src/data/promoCodes';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import Breadcrumb from '../src/components/ui/Breadcrumb';

const DELIVERY_FEE = 15;

const baht = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

export default function Cart() {
  const { items, updateQuantity, removeFromCart, discountRate, applyDiscount } = useCart();
  
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', isError: false });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();

    if (!cleanCode) {
      setPromoMessage({ text: 'Please enter a promo code', isError: true });
      return;
    }

    if (PROMO_CODES[cleanCode] !== undefined) {
      const discount = PROMO_CODES[cleanCode];
      applyDiscount(discount);
      setPromoMessage({ 
        text: `Promo code ${cleanCode} (${discount * 100}%) applied!`, 
        isError: false 
      });
      setPromoInput('');
    } else {
      setPromoMessage({ text: 'Invalid or expired promo code', isError: true });
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * discountRate);
  const currentDeliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal - discount) + currentDeliveryFee;

  return (
    <Container className="max-w-[1160px] py-6 md:py-8">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />

      <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-black md:text-3xl leading-none font-integral">
        YOUR CART
      </h1>

      {items.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-6 rounded-[20px] bg-white p-12 text-center border border-black/10">
          <p className="text-lg font-semibold">Your cart is currently empty</p>
          <Button to="/products" className="bg-primary text-white hover:opacity-90 rounded-full px-8" size="lg">
            Shop Now
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-5 lg:flex-row items-start justify-between">
          
          {/* Cart Items List Container - Compact Width */}
          <div className="w-full lg:w-[680px] shrink-0 flex flex-col rounded-[20px] border border-black/10 bg-white px-5 py-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                <div className="flex items-center gap-4 py-2">
                  
                  {/* รูปสินค้า */}
                  <div className="size-20 md:size-[110px] shrink-0 overflow-hidden rounded-[8px] bg-[#F0F0F0]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-black/40">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* รายละเอียดสินค้า */}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base md:text-lg leading-snug text-black truncate">{item.name}</p>
                    {item.size && (
                      <p className="mt-0.5 text-xs md:text-sm text-black/60">
                        Size: <span className="text-black/60">{item.size}</span>
                      </p>
                    )}
                    {item.color && (
                      <p className="mt-0.5 text-xs md:text-sm text-black/60">
                        Color: <span className="text-black/60">{item.color}</span>
                      </p>
                    )}
                    <p className="mt-1.5 text-lg md:text-xl font-bold text-black">{baht(item.price)}</p>
                  </div>

                  {/* ปุ่มลบ และ ปุ่มปรับจำนวน */}
                  <div className="flex flex-col items-end justify-between h-20 md:h-[110px] py-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-[#FF3333] transition hover:opacity-70"
                    >
                      <Trash2 className="size-4.5 md:size-5" />
                    </button>

                    <div className="flex h-8 md:h-9 w-24 md:w-[110px] items-center justify-between rounded-full bg-[#F0F0F0] px-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="grid place-items-center text-black font-bold transition hover:opacity-70"
                      >
                        <Minus className="size-3 md:size-3.5" />
                      </button>
                      <span className="text-xs md:text-sm font-semibold text-black">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="grid place-items-center text-black font-bold transition hover:opacity-70"
                      >
                        <Plus className="size-3 md:size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* เส้นคั่นระหว่างรายการสินค้า */}
                {index < items.length - 1 && (
                  <div className="my-3 border-t border-black/10" />
                )}
              </div>
            ))}
          </div>

          {/* Order Summary Side Card - Compact Width */}
          <aside className="w-full lg:w-[440px] shrink-0 rounded-[20px] border border-black/10 bg-white px-5 py-5" aria-label="Order Summary">
            <h2 className="text-lg md:text-xl font-bold text-black">Order Summary</h2>

            <dl className="mt-4 flex flex-col gap-3.5 text-sm md:text-base">
              <div className="flex justify-between items-center">
                <dt className="text-black/60">Subtotal</dt>
                <dd className="font-bold text-black">{baht(subtotal)}</dd>
              </div>
              
              {discountRate > 0 && (
                <div className="flex justify-between items-center">
                  <dt className="text-black/60">Discount (-{Math.round(discountRate * 100)}%)</dt>
                  <dd className="font-bold text-[#FF3333]">-{baht(discount)}</dd>
                </div>
              )}

              <div className="flex justify-between items-center">
                <dt className="text-black/60">Delivery Fee</dt>
                <dd className="font-bold text-black">{baht(currentDeliveryFee)}</dd>
              </div>
            </dl>

            <div className="my-4 border-t border-black/10" />

            <div className="flex items-center justify-between">
              <span className="text-base md:text-lg text-black font-medium">Total</span>
              <span className="text-lg md:text-xl font-bold text-black">{baht(total)}</span>
            </div>

            {/* Promo Code Form */}
            <form
              className="mt-5 flex items-center gap-2.5"
              onSubmit={handleApplyPromo}
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Add promo code"
                  aria-label="Promo Code"
                  className="h-11 w-full rounded-full bg-[#F0F0F0] pl-10 pr-3 text-sm text-black placeholder:text-black/40 focus:outline-none"
                />
                <Tag className="absolute left-3.5 top-3 size-4.5 text-black/40" />
              </div>
              <button
                type="submit"
                className="h-11 px-6 rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 shrink-0"
              >
                Apply
              </button>
            </form>

            {promoMessage.text && (
              <p className={`mt-2 text-xs ${promoMessage.isError ? 'text-[#FF3333]' : 'text-green-600'}`}>
                {promoMessage.text}
              </p>
            )}

            {/* ปุ่ม Go to Checkout */}
            <Link
              to="/checkout"
              className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition hover:opacity-90"
            >
              Go to Checkout
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </aside>

        </div>
      )}
    </Container>
  );
}