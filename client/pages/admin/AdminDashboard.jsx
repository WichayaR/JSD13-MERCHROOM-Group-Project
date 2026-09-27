import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../src/api/dashboard.api';
import StatCard from '../../src/components/admin/StatCard';
import AdminPanel from '../../src/components/admin/AdminPanel';
import AdminTable from '../../src/components/admin/AdminTable';
import AdminBadge from '../../src/components/admin/AdminBadge';
import RevenueTrendChart from '../../src/components/admin/charts/RevenueTrendChart';
import CategoryDonutChart from '../../src/components/admin/charts/CategoryDonutChart';
const money = (value) => (value === null || value === undefined ? '—' : `฿${Number(value).toLocaleString()}`);
const tableMessage = (message, columns) => <tr><td colSpan={columns}>{message}</td></tr>;

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    getDashboardStats()
      .then((res) => {
        if (!isMounted) return;
        if (res && res.stats) {
          setData(res);
        } else {
          setData(null);
          setError('The live dashboard returned no data.');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setData(null);
        setError('Unable to load live dashboard data. Check the server and MongoDB Atlas connection.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = data?.stats;
  const revenueTrend = data?.revenueTrend || [];
  const salesByCategory = data?.salesByCategory || [];
  const lowStock = data?.lowStock || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="admin-page">
      {loading && <p className="admin-data-state">Loading live dashboard data…</p>}
      {error && <p className="admin-data-state error">{error}</p>}
      <div className="stat-grid">
        <StatCard label="Total Revenue" value={money(stats?.totalRevenue)} />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? '—'} />
        <StatCard label="Total Products" value={stats?.totalProducts ?? '—'} />
        <StatCard dark label="Low Stock Alert" value={stats?.lowStockCount ?? '—'} note="Items with 10 or fewer units" />
      </div>

      <div className="dashboard-grid">
        <AdminPanel title="Revenue Trend">
          <RevenueTrendChart data={revenueTrend} />
        </AdminPanel>
        <AdminPanel title="Sales by Category">
          <CategoryDonutChart data={salesByCategory} />
        </AdminPanel>
      </div>

      <div className="dashboard-grid">
        <AdminPanel title="Low Stock Inventory">
          <AdminTable columns={['Product', 'Artist', 'In stock']}>
            {lowStock.length ? lowStock.map((item, idx) => (
              <tr key={item._id || item.id || idx}>
                <td>{item.name || '—'}</td>
                <td>{item.artist?.name || (typeof item.artist === 'string' ? item.artist : '—')}</td>
                <td>{item.quantity ?? 0}</td>
              </tr>
            )) : tableMessage(loading ? 'Loading live data…' : 'No live low-stock data.', 3)}
          </AdminTable>
        </AdminPanel>

        <AdminPanel title="Recent Orders">
          <AdminTable columns={['Order', 'Customer', 'Total', 'Status']}>
            {recentOrders.length ? recentOrders.map((item, idx) => {
              const customerName = item.userId
                ? typeof item.userId === 'object'
                  ? `${item.userId.firstName || ''} ${item.userId.lastName || ''}`.trim() || item.userId.email || 'Customer'
                  : item.userId
                : 'Customer';
              const orderId = String(item._id || item.orderNumber || idx);
              return (
                <tr key={item._id || idx}>
                  <td>#{orderId.length > 6 ? orderId.slice(-6) : orderId}</td>
                  <td>{customerName}</td>
                  <td>{money(item.totalAmount ?? 0)}</td>
                  <td><AdminBadge status={item.status || item.deliveryStatus || 'pending'} /></td>
                </tr>
              );
            }) : tableMessage(loading ? 'Loading live data…' : 'No live orders yet.', 4)}
          </AdminTable>
        </AdminPanel>
      </div>
    </div>
  );
}
