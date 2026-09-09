import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CreditCard, Landmark, QrCode, Truck } from 'lucide-react';
import { useCart } from '../src/context/CartContext';
import {
  PAYMENT_METHODS,
  generateOrderId,
  saveOrder,
} from '../src/utils/orderStorage';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import Breadcrumb from '../src/components/ui/Breadcrumb';

const DELIVERY_FEE = 15;

const PROMO_CODES = {
  MERCH10: 0.1,
  MERCHROOM: 0.2,
  HELLO15: 0.15,
};

const paymentIcons = {
  promptpay: QrCode,
  card: CreditCard,
  bank: Landmark,
  cod: Truck,
};

const baht = (value) => `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

const inputClasses =
  'h-11 w-full rounded-pill bg-cream px-4 text-sm placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-violet';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const promoCodeFromUrl = (searchParams.get('promo') || '').toUpperCase();
  const promoRate = PROMO_CODES[promoCodeFromUrl] || 0;
  const promoDiscount = Math.round(cartTotal * promoRate);
  const total = cartTotal - promoDiscount + DELIVERY_FEE;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('promptpay');
  const [cardFields, setCardFields] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateCardField = (e) => {
    const { name, value } = e.target;
    setCardFields((prev) => ({ ...prev, [name]: value }));
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  const validate = () => {
    const next = {};

    if (!form.firstName.trim()) next.firstName = 'กรุณากรอกชื่อ';
    if (!form.lastName.trim()) next.lastName = 'กรุณากรอกนามสกุล';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'อีเมลไม่ถูกต้อง';
    if (!form.phone.trim() || !/^\d{9,10}$/.test(form.phone.trim()))
      next.phone = 'เบอร์โทรไม่ถูกต้อง (9-10 หลัก)';
    if (form.address.trim().length < 10) next.address = 'กรุณากรอกที่อยู่ให้ครบถ้วน (อย่างน้อย 10 ตัวอักษร)';

    if (paymentMethod === 'card') {
      if (!/^\d{16}$/.test(cardFields.cardNumber.replace(/\s/g, '')))
        next.cardNumber = 'เลขบัตรต้องเป็น 16 หลัก';
      if (!cardFields.cardName.trim()) next.cardName = 'กรุณากรอกชื่อบนบัตร';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardFields.cardExpiry.trim()))
        next.cardExpiry = 'รูปแบบ MM/YY';
      if (!/^\d{3}$/.test(cardFields.cardCvv.trim())) next.cardCvv = 'CVV 3 หลัก';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const orderId = generateOrderId();
    const now = new Date().toISOString();

    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      brand: item.brand || '',
      image: item.image || '',
      price: item.price,
      quantity: item.quantity,
    }));

    const order = {
      id: orderId,
      items: orderItems,
      subtotal: cartTotal,
      promoCode: promoRate > 0 ? promoCodeFromUrl : null,
      promoDiscount: promoRate > 0 ? promoDiscount : 0,
      deliveryFee: DELIVERY_FEE,
      totalAmount: total,
      paymentMethod,
      paymentMethodLabel: selectedMethod?.label || paymentMethod,
      paymentStatus: 'paid',
      status: 'pending',
      deliveryStatus: 'pending',
      shippingProvider: 'Kerry Express',
      shippingAddress: `${form.address} (${form.firstName} ${form.lastName} โทร ${form.phone})`,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      createdAt: now,
    };

    saveOrder(order);
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <Container className="py-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
        <div className="mt-10 flex flex-col items-center gap-6 rounded-card bg-white p-16 text-center">
          <p className="text-lg font-semibold">ตะกร้าของคุณว่างเปล่า</p>
          <Button to="/products" variant="primary" size="lg">
            ไปเลือกสินค้า
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]}
      />

      <h1 className="mt-4 text-3xl font-bold uppercase md:text-4xl">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-8">
          <section className="rounded-card bg-white p-6 md:p-8" aria-label="ข้อมูลจัดส่ง">
            <h2 className="text-lg font-bold">Shipping Information</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">
                  ชื่อ <span className="text-error">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={updateField}
                  placeholder="เช่น สมชาย"
                  className={inputClasses}
                />
                {errors.firstName && <p className="mt-1 text-sm text-error">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">
                  นามสกุล <span className="text-error">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={updateField}
                  placeholder="เช่น ใจดี"
                  className={inputClasses}
                />
                {errors.lastName && <p className="mt-1 text-sm text-error">{errors.lastName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  อีเมล <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="example@email.com"
                  className={inputClasses}
                />
                {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  เบอร์โทรศัพท์ <span className="text-error">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="0812345678"
                  className={inputClasses}
                />
                {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
                  ที่อยู่จัดส่ง <span className="text-error">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={updateField}
                  placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                  className="w-full rounded-btn bg-cream px-4 py-3 text-sm placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-violet"
                />
                {errors.address && <p className="mt-1 text-sm text-error">{errors.address}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-card bg-white p-6 md:p-8" aria-label="เลือกวิธีการชำระเงิน">
            <h2 className="text-lg font-bold">Payment Method</h2>
            <p className="mt-1 text-sm text-muted">เลือกวิธีการชำระเงินสำหรับคำสั่งซื้อของคุณ</p>

            <div className="mt-6 flex flex-col gap-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = paymentIcons[method.id];
                const active = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-btn border-2 p-4 transition ${
                      active ? 'border-violet bg-violet/5' : 'border-ink/10 bg-cream hover:border-ink/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={active}
                      onChange={() => setPaymentMethod(method.id)}
                      className="size-4 accent-violet"
                    />
                    <Icon className="size-6 shrink-0 text-ink/70" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold">{method.label}</p>
                      <p className="text-xs text-muted">{method.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-5 grid gap-4 rounded-btn bg-cream p-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="cardNumber" className="mb-1.5 block text-sm font-medium">
                    เลขบัตร <span className="text-error">*</span>
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    inputMode="numeric"
                    value={cardFields.cardNumber}
                    onChange={updateCardField}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className={inputClasses}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-error">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cardName" className="mb-1.5 block text-sm font-medium">
                    ชื่อบนบัตร <span className="text-error">*</span>
                  </label>
                  <input
                    id="cardName"
                    name="cardName"
                    type="text"
                    value={cardFields.cardName}
                    onChange={updateCardField}
                    placeholder="NAME SURNAME"
                    className={inputClasses}
                  />
                  {errors.cardName && <p className="mt-1 text-sm text-error">{errors.cardName}</p>}
                </div>
                <div>
                  <label htmlFor="cardExpiry" className="mb-1.5 block text-sm font-medium">
                    วันหมดอายุ <span className="text-error">*</span>
                  </label>
                  <input
                    id="cardExpiry"
                    name="cardExpiry"
                    type="text"
                    value={cardFields.cardExpiry}
                    onChange={updateCardField}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={inputClasses}
                  />
                  {errors.cardExpiry && (
                    <p className="mt-1 text-sm text-error">{errors.cardExpiry}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="cardCvv" className="mb-1.5 block text-sm font-medium">
                    CVV <span className="text-error">*</span>
                  </label>
                  <input
                    id="cardCvv"
                    name="cardCvv"
                    type="password"
                    inputMode="numeric"
                    value={cardFields.cardCvv}
                    onChange={updateCardField}
                    placeholder="123"
                    maxLength="3"
                    className={inputClasses}
                  />
                  {errors.cardCvv && <p className="mt-1 text-sm text-error">{errors.cardCvv}</p>}
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="rounded-card bg-white p-6 md:p-8" aria-label="สรุปคำสั่งซื้อ">
          <h2 className="text-lg font-bold">Order Summary</h2>

          <div className="mt-5 flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="size-14 shrink-0 overflow-hidden rounded-btn bg-cream">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted">
                      -
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted">
                    {baht(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold">{baht(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <dl className="mt-5 flex flex-col gap-3 border-t border-ink/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{baht(cartTotal)}</dd>
            </div>
            {promoRate > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">
                  Promo ({promoCodeFromUrl}, -{promoRate * 100}%)
                </dt>
                <dd className="font-semibold text-error">-{baht(promoDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Delivery Fee</dt>
              <dd className="font-semibold">{baht(DELIVERY_FEE)}</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between rounded-btn bg-cream px-5 py-3.5">
            <span className="font-bold">Total</span>
            <span className="font-[Sarabun] text-xl font-bold">{baht(total)}</span>
          </div>

          <Button type="submit" variant="dark" size="lg" className="mt-6 w-full">
            Place Order
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          <p className="mt-3 text-center text-xs text-muted">
            ชำระเงินแบบทดลอง (mock payment) — ไม่มีการเรียกเก็บเงินจริง
          </p>
        </aside>
      </form>
    </Container>
  );
}