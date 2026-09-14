// pages/Account/OrderHistory.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../src/context/AccountContext';
import { OrderStatusBadge } from '../../src/components/ui/OrderStatusBadge';

export default function OrderHistory() {
  const { orders, loading } = useAccount();
  const [filterRange, setFilterRange] = useState('ALL');
  const navigate = useNavigate();

  const filteredOrders = orders.filter((order) => {
    if (filterRange === 'LAST_30') {
      const orderDate = new Date(order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }
    return true;
  });

  if (loading) return <div className="p-8 font-sans font-bold">LOADING ORDERS...</div>;

  return (
    <div className="bg-white border border-ink shadow-card rounded-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-sans font-extrabold text-2xl tracking-tight text-ink uppercase">
          ORDER HISTORY
        </h2>

        {/* Date Filter Tabs */}
        <div className="flex gap-1 bg-cream p-1 border border-ink rounded-btn">
          <button
            onClick={() => setFilterRange('LAST_30')}
            className={`px-3 py-1 font-sans text-[11px] font-extrabold tracking-wider rounded-btn transition-all ${
              filterRange === 'LAST_30'
                ? 'bg-ink text-cream-text'
                : 'text-ink bg-transparent hover:bg-white'
            }`}
          >
            LAST 30 DAYS
          </button>
          <button
            onClick={() => setFilterRange('ALL')}
            className={`px-3 py-1 font-sans text-[11px] font-extrabold tracking-wider rounded-btn transition-all ${
              filterRange === 'ALL'
                ? 'bg-ink text-cream-text'
                : 'text-ink bg-transparent hover:bg-white'
            }`}
          >
            ALL TIME
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center font-sans font-bold text-muted">
          NO ORDERS FOUND.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-ink font-sans text-xs font-extrabold tracking-wider text-ink">
                <th className="py-3 px-3">ORDER ID</th>
                <th className="py-3 px-3">DATE</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">TOTAL</th>
                <th className="py-3 px-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-sans">
              {filteredOrders.map((order) => {
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <tr key={order._id} className="hover:bg-cream/50">
                    <td className="py-4 px-3 font-bold text-ink">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 px-3 text-gray-600">{formattedDate}</td>
                    <td className="py-4 px-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-3 font-extrabold text-ink">
                      ฿{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-3">
                      <button
                        onClick={() => navigate(`/account/orders/${order._id}`)}
                        className="px-3 py-1.5 bg-transparent border border-ink text-ink font-sans font-bold text-[11px] tracking-wider rounded-btn hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                      >
                        DETAILS &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}