// pages/Account/OrderHistory.jsx
// components Order History
// สถานะคำสั่งซื้อ: Delivered
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AccountProvider, useAccount } from '../../src/context/AccountContext';

function OrderHistoryContent() {
  const { orders, loading, error } = useAccount();
  const navigate = useNavigate();

  // แท็บตัวกรองช่วงเวลา: ALL_TIME 
  const [filterRange, setFilterRange] = useState('ALL_TIME');

  // ฟังก์ชันกรองรายการคำสั่งซื้อตามช่วงเวลา
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    if (filterRange === 'LAST_30') {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const recent = orders.filter((order) => {
        const orderDate = new Date(order.createdAt || order.purchaseDate);
        return orderDate >= thirtyDaysAgo;
      });

      // กรณี Mock data อยู่ในอดีต ให้กรอง 30 วันนับจากออเดอร์ล่าสุด เพื่อให้เห็นผลการทำงานของแท็บ
      if (recent.length === 0 && orders.length > 0) {
        const timestamps = orders.map((o) =>
          new Date(o.createdAt || o.purchaseDate).getTime()
        );
        const maxTimestamp = Math.max(...timestamps);
        const cutoff = new Date(maxTimestamp);
        cutoff.setDate(cutoff.getDate() - 30);
        return orders.filter(
          (o) => new Date(o.createdAt || o.purchaseDate) >= cutoff
        );
      }

      return recent;
    }

    return orders;
  }, [orders, filterRange]);

  // จัดฟอร์แมตวันที่ให้ตรงตาม Wireframe เช่น Oct 24, 2024
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // กำหนดสีจุดสถานะโดยใช้ Token 
  const getStatusConfig = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed':
        return {
          label: 'Completed',
          dotColor: 'bg-primary',
        };
      case 'pending':
        return {
          label: 'Pending',
          dotColor: 'bg-muted',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          dotColor: 'bg-error',
        };
      case 'shipped':
        return {
          label: 'Shipped',
          dotColor: 'bg-warning',
        };
      default:
        return {
          label: status || 'Pending',
          dotColor: 'bg-muted',
        };
    }
  };

  return (
    <div className="w-full bg-cream min-h-screen text-ink">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 sm:py-16">
        {/* Breadcrumb Section: Home > Account > Order History */}
        <nav className="flex items-center gap-2 text-xs font-mono tracking-wider text-muted mb-8 sm:mb-10">
          <Link to="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span className="text-muted/60">&gt;</span>
          <Link to="/account" className="hover:text-ink transition-colors">
            Account
          </Link>
          <span className="text-muted/60">&gt;</span>
          <span className="text-ink font-bold">Order History</span>
        </nav>

        {/* Header Section: Title, Subtitle, and Date Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-ink/15">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink font-sans tracking-tight">
              Order History
            </h1>
            <p className="text-sm sm:text-base text-ink-soft/70 font-sans mt-2">
              Review your past drops and artist collaborations.
            </p>
          </div>

          {/* Date Filter Tabs: LAST 30 DAYS / ALL TIME */}
          <div className="flex items-center gap-8 self-start md:self-end">
            <button
              type="button"
              onClick={() => setFilterRange('LAST_30')}
              className={`text-xs font-mono tracking-widest uppercase pb-4 -mb-[17px] border-b-2 transition-all cursor-pointer ${
                filterRange === 'LAST_30'
                  ? 'border-ink text-ink font-bold'
                  : 'border-transparent text-muted font-medium hover:text-ink'
              }`}
            >
              LAST 30 DAYS
            </button>
            <button
              type="button"
              onClick={() => setFilterRange('ALL_TIME')}
              className={`text-xs font-mono tracking-widest uppercase pb-4 -mb-[17px] border-b-2 transition-all cursor-pointer ${
                filterRange === 'ALL_TIME'
                  ? 'border-ink text-ink font-bold'
                  : 'border-transparent text-muted font-medium hover:text-ink'
              }`}
            >
              ALL TIME
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-error">{error}</p>}

        {/* Orders Table Section */}
        {loading ? (
          <div className="py-20 text-center font-mono text-sm tracking-wider text-muted">
            LOADING ORDERS...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center font-mono text-sm tracking-wider text-muted">
            NO ORDERS FOUND
          </div>
        ) : (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink/15 text-[11px] font-mono tracking-widest text-muted uppercase">
                  <th className="py-5 px-3 font-semibold">ORDER ID</th>
                  <th className="py-5 px-3 font-semibold">DATE</th>
                  <th className="py-5 px-3 font-semibold">STATUS</th>
                  <th className="py-5 px-3 font-semibold">TOTAL</th>
                  <th className="py-5 px-3 font-semibold text-right">
                    <span className="sr-only">ACTIONS</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 text-sm">
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const displayOrderId = order.orderNumber
                    ? `#${order.orderNumber.replace(/^#/, '')}`
                    : `#${order._id.slice(-6).toUpperCase()}`;
                  const orderDate = formatDate(order.createdAt || order.purchaseDate);
                  const formattedTotal = Number(order.totalAmount || 0).toLocaleString();

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-ink/[0.02] transition-colors"
                    >
                      {/* Column: Order ID */}
                      <td className="py-6 px-3 font-mono font-bold text-xs sm:text-sm text-ink whitespace-nowrap">
                        {displayOrderId}
                      </td>

                      {/* Column: Date */}
                      <td className="py-6 px-3 font-sans text-xs sm:text-sm text-ink-soft whitespace-nowrap">
                        {orderDate}
                      </td>

                      {/* Column: Status */}
                      <td className="py-6 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${statusConfig.dotColor} shrink-0`}
                          />
                          <span className="font-mono text-xs sm:text-sm font-medium text-ink">
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>

                      {/* Column: Total */}
                      <td className="py-6 px-3 font-mono font-bold text-xs sm:text-sm text-ink whitespace-nowrap">
                        ฿{formattedTotal}
                      </td>

                      {/* Column: Action VIEW DETAILS */}
                      <td className="py-6 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => navigate(`/account/orders/${order._id}`)}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-wider text-ink hover:text-primary transition-colors cursor-pointer group"
                        >
                          <span>VIEW DETAILS</span>
                          <span className="transition-transform group-hover:translate-x-1">
                            &rarr;
                          </span>
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
    </div>
  );
}

export default function OrderHistory() {
  return (
    <AccountProvider>
      <OrderHistoryContent />
    </AccountProvider>
  );
}
