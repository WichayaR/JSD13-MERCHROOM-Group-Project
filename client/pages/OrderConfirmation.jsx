// ไฟล์: client/pages/OrderConfirmation.jsx
// หน้าแสดงผลการสั่งซื้อสำเร็จและติดตามสถานะจัดส่ง (Order Confirmation & Tracking)
// เรียกมาจาก: App.jsx ผ่าน Route path="/order-confirmation/:orderId" (ส่งต่อมาจากหน้า /checkout)
// แหล่งข้อมูล: ดึงออเดอร์ตาม id จาก LocalStorage (orderStorage.js) หรือ mockOrders.js
import { useParams } from 'react-router-dom';
import {
  BadgeCheck,
  CheckCircle2,
  CircleDashed,
  CreditCard,
  PackageCheck,
  PackageSearch,
  Truck,
} from 'lucide-react';
import { getOrderById as getLocalOrderById } from '../src/utils/orderStorage';
import { getOrderById as getMockOrderById } from '../src/data/mockup/mockOrders';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import Breadcrumb from '../src/components/ui/Breadcrumb';

const timelineIcons = {
  pending: PackageSearch,
  shipping: PackageCheck,
  in_transit: Truck,
  delivered: BadgeCheck,
  cancelled: CircleDashed,
};

const baht = (value) => `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

const DELIVERY_STEPS = [
  {
    key: 'pending',
    label: 'รับคำสั่งซื้อ',
    description: 'คำสั่งซื้อได้รับการยืนยันแล้ว',
    icon: PackageSearch,
  },
  {
    key: 'shipping',
    label: 'เตรียมจัดส่ง',
    description: 'กำลังแพ็คสินค้าเพื่อส่ง',
    icon: PackageCheck,
  },
  {
    key: 'in_transit',
    label: 'อยู่ระหว่างขนส่ง',
    description: 'สินค้าอยู่ระหว่างการขนส่ง',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'ได้รับสินค้า',
    description: 'จัดส่งสำเร็จแล้ว',
    icon: BadgeCheck,
  },
];

const PAYMENT_STATUS_META = {
  paid: { label: 'ชำระเงินแล้ว', classes: 'bg-success/15 text-success' },
  pending: { label: 'รอชำระเงิน', classes: 'bg-warning/15 text-warning' },
  failed: { label: 'ชำระเงินไม่สำเร็จ', classes: 'bg-error/15 text-error' },
};

function StatusPill({ order }) {
  const meta = PAYMENT_STATUS_META[order.paymentStatus] || PAYMENT_STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold ${meta.classes}`}>
      <CheckCircle2 className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

// หน้าแสดงใบเสร็จและติดตามสถานะคำสั่งซื้อ
export default function OrderConfirmation() {
  const { orderId } = useParams();
  // ค้นหาออเดอร์จาก localStorage ก่อน ถ้าไม่เจอค่อยไปค้นจาก mock data
  const order = getLocalOrderById(orderId) || getMockOrderById(orderId);

  // ดักกรณีอ้างอิงเลขออเดอร์ที่ไม่ถูกต้อง
  if (!order) {
    return (
      <Container className="py-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Order Status' }]} />
        <div className="mt-10 flex flex-col items-center gap-6 rounded-card bg-white p-16 text-center">
          <p className="text-lg font-semibold">ไม่พบคำสั่งซื้อนี้</p>
          <Button to="/products" variant="primary" size="lg">
            ไปเลือกสินค้า
          </Button>
        </div>
      </Container>
    );
  }

  // หา step ปัจจุบันในไทม์ไลน์การจัดส่ง
  const deliveryIndex = DELIVERY_STEPS.findIndex(
    (step) => step.key === order.deliveryStatus,
  );
  const isCancelled = order.deliveryStatus === 'cancelled';
  const orderIdDisplay = order._id || order.id;

  return (
    <Container className="py-10">
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Order Status' }]}
      />

      <div className="mt-4 flex flex-col items-start gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold uppercase md:text-4xl">Order Confirmed</h1>
          <StatusPill order={order} />
        </div>
        <p className="text-sm text-muted">
          Order ID: <span className="font-semibold text-ink">{orderIdDisplay}</span> · สั่งซื้อเมื่อ{' '}
          {new Date(order.createdAt).toLocaleString('th-TH')}
        </p>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          {/* ไทม์ไลน์สถานะการจัดส่ง 4 สเต็ป (รับคำสั่งซื้อ -> แพ็คของ -> ขนส่ง -> สำเร็จ) */}
          <section className="rounded-card bg-white p-6 md:p-8" aria-label="สถานะการจัดส่ง">
            <h2 className="text-lg font-bold">Delivery Status</h2>
            <p className="mt-1 text-sm text-muted">
              ผู้ให้บริการจัดส่ง: <span className="font-medium text-ink">{order.shippingProvider}</span>
            </p>

            {isCancelled ? (
              <div className="mt-8 rounded-btn bg-error/10 p-5 text-sm font-semibold text-error">
                คำสั่งซื้อนี้ถูกยกเลิก
              </div>
            ) : (
              // แสดง 4 สเต็ปจัดส่ง พร้อมไฮไลต์สเต็ปปัจจุบัน
              <ol className="mt-8 grid gap-0 sm:grid-cols-4 sm:gap-2">
                {DELIVERY_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isDone = index < deliveryIndex;
                  const isCurrent = index === deliveryIndex;
                  return (
                    <li key={step.key} className="relative">
                      <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:text-center">
                        <div
                          className={`grid size-11 shrink-0 place-items-center rounded-pill border-2 ${
                            isDone || isCurrent
                              ? 'border-success bg-success/10 text-success'
                              : 'border-ink/15 bg-cream text-muted'
                          }`}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </div>
                        {index < DELIVERY_STEPS.length - 1 && (
                          <span
                            className={`hidden h-0.5 flex-1 sm:block ${
                              isDone ? 'bg-success' : 'bg-ink/10'
                            }`}
                          />
                        )}
                      </div>
                      <p className={`mt-2 text-sm font-semibold ${isCurrent ? 'text-ink' : 'text-muted'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted">{step.description}</p>
                      {isCurrent && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-success">
                          <CircleDashed className="size-3 animate-spin" aria-hidden="true" />
                          กำลังดำเนินการ
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}

            {/* บันทึกวันและเวลาแต่ละขั้นตอนย่อย (Date Time Stamp) */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="mt-8 border-t border-ink/10 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  Timeline & Date Time Stamp
                </h3>
                <ol className="mt-4 flex flex-col gap-0">
                  {order.timeline
                    .filter((t) => t.time)
                    .map((t, i) => {
                      const Icon = timelineIcons[t.status] || CircleDashed;
                      return (
                        <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="grid size-8 shrink-0 place-items-center rounded-pill bg-cream text-ink ring-1 ring-ink/10">
                              <Icon className="size-4" aria-hidden="true" />
                            </div>
                            {i < order.timeline.filter((x) => x.time).length - 1 && (
                              <span className="w-px flex-1 bg-ink/10" />
                            )}
                          </div>
                          <div className="pt-1">
                            <p className="text-sm font-semibold text-ink">{t.label}</p>
                            <p className="text-xs text-muted">
                              {new Date(t.time).toLocaleString('th-TH')}
                            </p>
                            {t.note && <p className="mt-1 text-xs text-muted">{t.note}</p>}
                          </div>
                        </li>
                      );
                    })}
                </ol>
              </div>
            )}
          </section>

          {/* รายการสินค้าทั้งหมดในออเดอร์นี้ */}
          <section className="rounded-card bg-white p-6 md:p-8" aria-label="สินค้าในคำสั่งซื้อ">
            <h2 className="text-lg font-bold">Items ({order.items.length})</h2>
            <div className="mt-5 flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-stretch gap-4 rounded-btn bg-cream p-4">
                  <div className="size-18 shrink-0 overflow-hidden rounded-btn bg-white">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        -
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <p className="font-semibold">{item.name}</p>
                    {item.brand && <p className="mt-0.5 text-xs text-muted">{item.brand}</p>}
                    <p className="mt-1 text-sm">
                      {baht(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="py-1">
                    <p className="font-semibold">{baht(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* สรุปยอดชำระเงิน วิธีจ่ายเงิน และที่อยู่จัดส่ง */}
        <div className="flex flex-col gap-8">
          <aside className="rounded-card bg-white p-6 md:p-8" aria-label="สรุปคำสั่งซื้อ">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold">{baht(order.subtotal)}</dd>
              </div>
              {order.promoCode && (
                <div className="flex justify-between">
                  <dt className="text-muted">Promo ({order.promoCode})</dt>
                  <dd className="font-semibold text-error">-{baht(order.promoDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Delivery Fee</dt>
                <dd className="font-semibold">{baht(order.deliveryFee)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between rounded-btn bg-cream px-5 py-3.5">
              <span className="font-bold">Total</span>
              <span className="font-[Sarabun] text-xl font-bold">{baht(order.totalAmount)}</span>
            </div>

            <div className="mt-5 rounded-btn bg-cream px-5 py-4 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 shrink-0 text-muted" aria-hidden="true" />
                <span className="text-muted">Payment Method</span>
              </div>
              <p className="mt-1 font-semibold">{order.paymentMethodLabel}</p>
            </div>

            <div className="mt-4 rounded-btn bg-cream px-5 py-4 text-sm">
              <p className="text-muted">Shipping Address</p>
              <p className="mt-1 leading-relaxed">{order.shippingAddress}</p>
            </div>
          </aside>

          <div className="flex flex-col gap-3">
            <Button to="/products" variant="dark" size="lg">
              Shop More
            </Button>
            <Button to="/" variant="outline" size="lg">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}