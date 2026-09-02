import { useState } from 'react';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../src/context/CartContext';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import Breadcrumb from '../src/components/ui/Breadcrumb';

const DISCOUNT_RATE = 0.2;
const DELIVERY_FEE = 15;

const baht = (value) => `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * DISCOUNT_RATE);
  const total = subtotal - discount + DELIVERY_FEE;

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />

      <h1 className="mt-4 text-3xl font-bold uppercase md:text-4xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-6 rounded-card bg-white p-16 text-center">
          <p className="text-lg font-semibold">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
          <Button to="/products" variant="primary" size="lg">
            ไปเลือกสินค้า
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-stretch gap-5 rounded-card bg-white p-5"
              >
                <div className="size-25 shrink-0 overflow-hidden rounded-btn bg-cream">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      ไม่มีรูป
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 py-1">
                  <p className="font-semibold">{item.name}</p>
                  {item.brand && <p className="mt-0.5 text-xs text-muted">{item.brand}</p>}
                  <p className="mt-2 font-[Sarabun] text-lg font-semibold">{baht(item.price)}</p>
                </div>

                <div className="flex flex-col items-end justify-between py-1">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`นำ ${item.name} ออกจากตะกร้า`}
                    className="text-error transition hover:opacity-70"
                  >
                    <Trash2 className="size-5" />
                  </button>

                  <div className="flex h-9 items-center gap-4 rounded-pill border border-ink/15 px-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`ลดจำนวน ${item.name}`}
                      className="grid size-6 place-items-center text-muted transition hover:text-ink"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-4 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`เพิ่มจำนวน ${item.name}`}
                      className="grid size-6 place-items-center text-muted transition hover:text-ink"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-card bg-white p-6 md:p-8" aria-label="สรุปคำสั่งซื้อ">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <dl className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold">{baht(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Discount (-{DISCOUNT_RATE * 100}%)</dt>
                <dd className="font-semibold text-error">-{baht(discount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery Fee</dt>
                <dd className="font-semibold">{baht(DELIVERY_FEE)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-center justify-between rounded-btn bg-cream px-5 py-3.5">
              <span className="font-bold">Total</span>
              <span className="font-[Sarabun] text-xl font-bold">{baht(total)}</span>
            </div>

            <form
              className="mt-6 flex items-center gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Add promo code"
                aria-label="รหัสส่วนลด"
                className="h-10 min-w-0 flex-1 rounded-pill bg-cream px-4 text-sm placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-violet"
              />
              <Button type="submit" variant="dark" size="md" className="shrink-0">
                Apply
              </Button>
            </form>

            <Button variant="dark" size="lg" className="mt-4 w-full">
              Go to Checkout
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </aside>
        </div>
      )}
    </Container>
  );
}
