// pages/Account/OrderDetail.jsx
// หน้ารายละเอียดคำสั่งซื้อ — อ้างอิงดีไซน์ Rounded 2xl อัพเดตตาม UI ในรูปตัวอย่าง
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, subscribeToMyOrderEvents } from '../../src/api/orders.api';
import { createReview } from '../../src/api/reviews.api';
import { OrderStepper } from '../../src/components/ui/OrderStepper';
import { OrderStatusBadge } from '../../src/components/ui/OrderStatusBadge';
import { getItemImage } from './OrderHistory';

const isReviewableStatus = (status) => ['delivered', 'completed'].includes(String(status || '').toLowerCase());

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewItem, setReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchOrder() {
      try {
        const data = await getOrderById(orderId);
        if (mounted) setOrder(data.order || null);
      } catch {
        if (mounted) setOrder(null);
      }
      if (mounted) setLoading(false);
    }
    fetchOrder();

    const unsubscribe = subscribeToMyOrderEvents((event) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (
          payload.type === 'status-updated' &&
          String(payload.orderId) === String(orderId)
        ) {
          fetchOrder();
        }
      } catch {
        // Ignore malformed events; the existing order remains visible.
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [orderId]);

  if (loading) return <div className="p-8 font-sans text-sm text-gray-500">Loading order details...</div>;

  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-sm">
        <h2 className="font-sans font-bold text-lg mb-4 text-gray-900">Order Not Found</h2>
        <button
          onClick={() => navigate('/account/orders')}
          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-sans text-xs font-semibold rounded-xl hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
        >
          &larr; Back to Orders
        </button>
      </div>
    );
  }

  const canReview = isReviewableStatus(order.status);
  const openReview = (item) => {
    setReviewItem(item);
    setRating(5);
    setComment('');
    setReviewError('');
  };
  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewItem?.productId || submittingReview) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      await createReview({ orderId: order._id, productId: reviewItem.productId, rating, comment });
      setReviewedProductIds((ids) => [...ids, String(reviewItem.productId)]);
      setReviewItem(null);
    } catch (error) {
      setReviewError(error.message || 'Unable to submit your review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
      {/* Back link & Header */}
      <div className="pb-4 border-b border-gray-100 flex flex-col gap-3">
        <button
          onClick={() => navigate('/account/orders')}
          className="font-sans font-semibold text-xs text-[#685bc7] hover:underline cursor-pointer flex items-center gap-1"
        >
          &larr; Back to Order History
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-sans font-bold text-xl text-gray-900 tracking-tight">
            Order #{order._id.slice(-6).toUpperCase()}
          </h2>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Stepper */}
      <OrderStepper currentStatus={order.status} />

      {/* Items Section */}
      <div>
        <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-gray-500 mb-4">
          Items in Order
        </h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200/80 bg-white shadow-2xs hover:border-gray-300 transition-all"
            >
              <img
                src={getItemImage(item)}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0 bg-gray-50"
              />
              <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                <span className="text-[10px] font-bold text-[#ff5b30] uppercase tracking-wider">
                  MERCHROOM OFFICIAL
                </span>
                <h4 className="font-sans font-bold text-sm text-gray-900 truncate">
                  {item.name}
                </h4>
                <span className="font-sans text-xs text-gray-500">
                  QTY: {item.quantity} &times; ฿{item.price.toLocaleString()}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="font-sans font-bold text-sm text-gray-900">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </div>
                {canReview && item.productId && (
                  <button
                    type="button"
                    onClick={() => openReview(item)}
                    disabled={reviewedProductIds.includes(String(item.productId))}
                    className="rounded-lg bg-[#685bc7] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#5746b4] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reviewedProductIds.includes(String(item.productId)) ? 'Reviewed' : 'Write a review'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!canReview && (
        <p className="rounded-xl bg-[#f4f1ff] px-4 py-3 text-xs font-medium text-[#51449d]">
          You can write a review after this order is delivered.
        </p>
      )}

      {/* Info & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 pt-4 border-t border-gray-100">
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-xl border border-gray-200/80 bg-gray-50/50 flex flex-col gap-2">
            <h4 className="font-sans font-semibold text-xs uppercase tracking-wider text-gray-500 mb-1">
              Shipping Info
            </h4>
            <p className="font-sans text-xs text-gray-800">
              <span className="font-semibold text-gray-900">Carrier:</span> {order.shippingProvider}
            </p>
            <p className="font-sans text-xs text-gray-800">
              <span className="font-semibold text-gray-900">Address:</span> {order.shippingAddress}
            </p>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-gray-900 text-white p-5 rounded-xl flex flex-col gap-3 shadow-sm">
          <h4 className="font-sans font-semibold text-xs uppercase tracking-wider text-gray-400 mb-1">
            Order Summary
          </h4>
          <div className="flex justify-between text-xs font-sans text-gray-300">
            <span>Total Amount</span>
            <span className="font-semibold text-white">฿{order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="h-[1px] bg-gray-800 my-1" />
          <div className="flex justify-between font-sans font-bold text-base text-white">
            <span>Grand Total</span>
            <span>฿{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {reviewItem && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <form onSubmit={submitReview} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Write a review</h3>
                <p className="mt-1 text-sm text-gray-500">{reviewItem.name}</p>
              </div>
              <button type="button" onClick={() => setReviewItem(null)} className="text-xl text-gray-500" aria-label="Close review form">×</button>
            </div>
            <div className="mt-5 flex gap-2" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} className={`text-3xl ${value <= rating ? 'text-[#ffb800]' : 'text-gray-200'}`} aria-label={`${value} stars`}>★</button>
              ))}
            </div>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} required maxLength={1000} placeholder="Tell us what you think about this product" className="mt-4 min-h-28 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#685bc7]" />
            {reviewError && <p className="mt-3 text-sm text-red-600" role="alert">{reviewError}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setReviewItem(null)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button disabled={submittingReview} className="rounded-xl bg-[#ff5b30] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{submittingReview ? 'Submitting…' : 'Submit review'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
