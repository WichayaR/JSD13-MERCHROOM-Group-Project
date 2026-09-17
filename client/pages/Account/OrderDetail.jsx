// pages/Account/OrderDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../src/api/orders.api';
import { OrderStepper } from '../../src/components/ui/OrderStepper';
import { OrderStatusBadge } from '../../src/components/ui/OrderStatusBadge';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderById(orderId);
        setOrder(data.order);
      } catch (requestError) {
        setError(requestError.message || 'ไม่สามารถโหลดคำสั่งซื้อได้');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-8 font-sans font-bold">LOADING ORDER DETAILS...</div>;

  if (!order) {
    return (
      <div className="bg-white border border-ink rounded-card p-8">
        <h2 className="font-sans font-extrabold text-xl mb-4">{error || 'ORDER NOT FOUND'}</h2>
        <button
          onClick={() => navigate('/account/orders')}
          className="bg-ink text-white px-4 py-2 rounded-btn font-sans text-xs font-bold"
        >
          BACK TO ORDERS
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-ink shadow-card rounded-card p-6 sm:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/account/orders')}
          className="text-violet font-sans font-bold text-xs tracking-wider hover:underline cursor-pointer mb-2 block"
        >
          &larr; BACK TO ORDERS
        </button>
        <div className="flex items-center gap-4">
          <h2 className="font-sans font-extrabold text-2xl tracking-tight text-ink uppercase">
            ORDER #{order._id.slice(-6).toUpperCase()}
          </h2>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <OrderStepper currentStatus={order.status} />

      {/* Items Section */}
      <div className="mb-8">
        <h3 className="font-sans font-extrabold text-xs tracking-wider text-ink uppercase mb-3">
          ITEMS IN ORDER
        </h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-3 border border-gray-200 rounded-btn"
            >
              <div className="w-16 h-16 bg-cream border border-ink rounded-btn flex items-center justify-center font-bold text-xs text-muted">
                ITEM
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="font-sans font-bold text-sm text-ink truncate">
                  {item.name}
                </h4>
                <span className="font-sans text-xs text-muted">
                  QTY: {item.quantity} × ฿{item.price.toLocaleString()}
                </span>
              </div>
              <div className="font-sans font-extrabold text-sm text-ink">
                ฿{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-cream border border-ink rounded-btn">
            <h4 className="font-sans font-extrabold text-xs tracking-wider text-ink mb-2 uppercase">
              SHIPPING INFO
            </h4>
            <p className="font-sans text-xs text-ink mb-1">
              <strong>CARRIER:</strong> {order.shippingProvider}
            </p>
            <p className="font-sans text-xs text-ink">
              <strong>ADDRESS:</strong> {order.shippingAddress}
            </p>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-ink text-cream-text p-5 rounded-btn flex flex-col gap-3">
          <h4 className="font-sans font-extrabold text-xs tracking-wider text-highlight uppercase mb-1">
            ORDER SUMMARY
          </h4>
          <div className="flex justify-between text-xs font-sans">
            <span>TOTAL AMOUNT</span>
            <span className="font-bold">฿{order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="h-[1px] bg-gray-700 my-1" />
          <div className="flex justify-between font-sans font-extrabold text-base text-white">
            <span>GRAND TOTAL</span>
            <span>฿{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
