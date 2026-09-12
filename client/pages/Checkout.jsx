import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';
import Container from '../src/components/ui/Container';
import Breadcrumb from '../src/components/ui/Breadcrumb';

const DELIVERY_FEE = 15;
const formatCurrency = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, discountRate = 0 } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discountRate);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal - discountAmount) + deliveryFee;

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [saveDefaultCard, setSaveDefaultCard] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', city: '', state: '', zipCode: '', country: '',
    addressLine: '', addressLine2: '', deliveryName: '', deliveryAddressLine: '',
    deliveryAddressLine2: '', deliveryCity: '', deliveryState: '', deliveryZipCode: '',
    deliveryCountry: '', cardName: '', cardNumber: '', expDate: '', cvc: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Processing',
      total: total,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size || 'M',
        color: item.color || 'Standard',
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
      })),
    };

    const existingOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
    localStorage.setItem('my_orders', JSON.stringify([newOrder, ...existingOrders]));

    if (clearCart) clearCart();
    navigate('/orders');
  };

  return (
    <Container className="max-w-[1160px] py-6 md:py-8">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-black md:text-3xl leading-none font-integral">
        CHECKOUT
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 lg:flex-row items-start justify-between">
        
        {/* Left Column: Form Sections */}
        <div className="w-full lg:w-[680px] shrink-0 flex flex-col gap-5">
          
          {/* Section 1: Contact Information */}
          <section className="rounded-[20px] border border-black/10 bg-white p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-black">Contact information</h2>
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                required
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                  required
                />
              </div>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                required
              />
              <input
                type="text"
                name="addressLine"
                placeholder="Address Line"
                value={formData.addressLine}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                required
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2 (Optional)"
                value={formData.addressLine2}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
              />
            </div>
          </section>

          {/* Section 2: Delivery */}
          <section className="rounded-[20px] border border-black/10 bg-white p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-black">Delivery</h2>
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                name="deliveryName"
                placeholder="Name"
                disabled={useSameAddress}
                value={useSameAddress ? formData.name : formData.deliveryName}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none disabled:opacity-50 focus:bg-white focus:ring-1 focus:ring-black/20"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="deliveryAddressLine"
                  placeholder="Address Line"
                  disabled={useSameAddress}
                  value={useSameAddress ? formData.addressLine : formData.deliveryAddressLine}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none disabled:opacity-50 focus:bg-white focus:ring-1 focus:ring-black/20"
                />
                <input
                  type="text"
                  name="deliveryAddressLine2"
                  placeholder="Address Line 2"
                  disabled={useSameAddress}
                  value={useSameAddress ? formData.addressLine2 : formData.deliveryAddressLine2}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none disabled:opacity-50 focus:bg-white focus:ring-1 focus:ring-black/20"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  name="deliveryCity"
                  placeholder="City"
                  disabled={useSameAddress}
                  value={useSameAddress ? formData.city : formData.deliveryCity}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none disabled:opacity-50 focus:bg-white focus:ring-1 focus:ring-black/20"
                />
                <input
                  type="text"
                  name="deliveryState"
                  placeholder="State"
                  disabled={useSameAddress}
                  value={useSameAddress ? formData.state : formData.deliveryState}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none disabled:opacity-50 focus:bg-white focus:ring-1 focus:ring-black/20"
                />
                <input
                  type="text"
                  name="deliveryZipCode"
                  placeholder="Zip Code"
                  disabled={useSameAddress}
                  value={useSameAddress ? formData.zipCode : formData.deliveryZipCode}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none disabled:opacity-50 focus:bg-white focus:ring-1 focus:ring-black/20"
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium text-black/70">Use same contact address</span>
                <button
                  type="button"
                  onClick={() => setUseSameAddress(!useSameAddress)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    useSameAddress ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block size-3.5 transform rounded-full bg-white transition-transform ${
                      useSameAddress ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Section 3: Payment */}
          <section className="rounded-[20px] border border-black/10 bg-white p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-black">Payment details</h2>
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                name="cardName"
                placeholder="Cardholder Name"
                value={formData.cardName}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                required
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_110px_90px]">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                  required
                />
                <input
                  type="text"
                  name="expDate"
                  placeholder="MM/YY"
                  value={formData.expDate}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-center text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                  required
                />
                <input
                  type="text"
                  name="cvc"
                  placeholder="CVC"
                  value={formData.cvc}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-[#F0F0F0] px-4 text-center text-sm outline-none placeholder:text-black/40 focus:bg-white focus:ring-1 focus:ring-black/20"
                  required
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium text-black/70">Save this card as default payment method</span>
                <button
                  type="button"
                  onClick={() => setSaveDefaultCard(!saveDefaultCard)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    saveDefaultCard ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block size-3.5 transform rounded-full bg-white transition-transform ${
                      saveDefaultCard ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="w-full lg:w-[440px] shrink-0 rounded-[20px] border border-black/10 bg-white p-5 md:p-6" aria-label="Order Summary">
          <h2 className="text-lg md:text-xl font-bold text-black">Order Summary</h2>

          {/* Mini Items List */}
          <div className="mt-4 max-h-[220px] overflow-y-auto divide-y divide-black/10 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2.5">
                <div className="size-12 shrink-0 overflow-hidden rounded-md bg-[#F0F0F0]">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs md:text-sm font-bold text-black">{item.name}</p>
                  <p className="text-xs text-black/60">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs md:text-sm font-bold text-black">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-black/10" />

          <dl className="flex flex-col gap-3 text-sm md:text-base">
            <div className="flex justify-between items-center">
              <dt className="text-black/60">Subtotal</dt>
              <dd className="font-bold text-black">{formatCurrency(subtotal)}</dd>
            </div>

            {discountRate > 0 && (
              <div className="flex justify-between items-center text-[#FF3333]">
                <dt>Discount (-{Math.round(discountRate * 100)}%)</dt>
                <dd className="font-bold">-{formatCurrency(discountAmount)}</dd>
              </div>
            )}

            <div className="flex justify-between items-center">
              <dt className="text-black/60">Delivery Fee</dt>
              <dd className="font-bold text-black">{formatCurrency(deliveryFee)}</dd>
            </div>
          </dl>

          <div className="my-4 border-t border-black/10" />

          <div className="flex justify-between items-center text-base md:text-lg font-bold text-black">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <button
            type="submit"
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-white transition hover:opacity-90"
          >
            Finish checkout
          </button>
        </aside>
      </form>
    </Container>
  );
}