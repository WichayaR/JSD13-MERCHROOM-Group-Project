import { Bell, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchAdminDatabase } from "../../api/dashboard.api";
import {
  getUnreadOrderNotifications,
  getOrderById,
  getOrders,
  markAllOrderNotificationsRead,
  markOrderNotificationRead,
  subscribeToOrderEvents,
} from "../../api/orders.api";
import { useAuth } from "../../context/AuthContext";

export default function AdminTopbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const page = useLocation().pathname.split("/").pop() || "dashboard";
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const paymentNotificationIds = useRef(new Set());

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearchError("");
      return undefined;
    }
    const timer = setTimeout(() => {
      searchAdminDatabase(query)
        .then((data) => {
          setResults(data.results || []);
          setSearchError("");
        })
        .catch((error) => {
          setResults([]);
          setSearchError(error.message || "ค้นหาไม่สำเร็จ");
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let mounted = true;
    const loadUnreadNotifications = async () => {
      try {
        const data = await getUnreadOrderNotifications();
        if (!mounted) return;
        const persistentByOrderId = new Map();
        (data?.notifications || []).forEach((notification) => {
          const orderId = String(notification.order?._id || "");
          if (!orderId || persistentByOrderId.has(orderId)) return;
          persistentByOrderId.set(orderId, {
            ...notification.order,
            _notificationId: notification._id,
            _notificationKey: `created-${notification._id}`,
            _notificationType: notification.type,
          });
        });
        const persistent = [...persistentByOrderId.values()];
        setNotifications((current) => [
          ...persistent,
          ...current.filter((notification) => {
            if (notification._notificationType === "payment-paid") return true;
            return !persistentByOrderId.has(String(notification._id));
          }),
        ].slice(0, 50));
      } catch {
        /* API errors are shown by their respective pages. */
      }
    };
    loadUnreadNotifications();
    const interval = window.setInterval(loadUnreadNotifications, 30000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  // Payment changes happen on an existing order, so polling for a new order ID
  // cannot detect them. The stream also delivers new orders immediately.
  useEffect(() => {
    const unsubscribe = subscribeToOrderEvents((event) => {
      try {
        const payload = JSON.parse(event.data || "{}");
        const orderId = String(payload.orderId || "");
        if (!orderId) return;

        if (payload.type === "created") {
          getOrderById(orderId)
            .then((data) => {
              const order = data?.order;
              if (!order) return;
              setNotifications((current) =>
                [
                  {
                    ...order,
                    _notificationId: payload.notificationId,
                    _notificationKey: `created-${payload.notificationId || order._id}`,
                    _notificationType: "created",
                  },
                  ...current.filter(
                    (item) =>
                      item._notificationKey !==
                      `created-${payload.notificationId || order._id}`,
                  ),
                ].slice(0, 10),
              );
            })
            .catch(() => {});
          return;
        }

        if (
          payload.type !== "payment-paid" ||
          paymentNotificationIds.current.has(orderId)
        )
          return;
        paymentNotificationIds.current.add(orderId);
        getOrders({ page: 1, limit: 100 })
          .then((data) => {
            const order = (data?.orders || []).find(
              (item) => String(item._id) === orderId,
            );
            if (!order) return;
            setNotifications((current) =>
              [
                {
                  ...order,
                  _notificationKey: `payment-${order._id}`,
                  _notificationType: "payment-paid",
                },
                ...current.filter(
                  (item) => item._notificationKey !== `payment-${order._id}`,
                ),
              ].slice(0, 10),
            );
          })
          .catch(() => {});
      } catch {
        // Ignore malformed event data and keep the notification stream alive.
      }
    });
    return unsubscribe;
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setSearchError("");
  };
  const chooseResult = (result) => {
    navigate(result.path);
    closeSearch();
  };
  const openNotification = async (notification) => {
    if (notification._notificationId) {
      try {
        await markOrderNotificationRead(notification._notificationId);
      } catch {
        return;
      }
    }
    setNotifications((current) =>
      current.filter((item) => item._notificationKey !== notification._notificationKey),
    );
    navigate("/admin/orders");
    setNotificationsOpen(false);
  };
  const markAllRead = async () => {
    try {
      await markAllOrderNotificationsRead();
      setNotifications([]);
    } catch {
      // Keep the visible notifications if the server could not mark them read.
    }
  };

  return (
    <header className="admin-topbar">
      <div>
        <small>HQ / ADMIN</small>
        <h1>{page.replace(/^./, (x) => x.toUpperCase())}</h1>
      </div>
      <div className="top-actions">
        <span className="sync-pill">● Live Sync Active</span>
        <div className="topbar-popover">
          <button
            className="topbar-icon"
            type="button"
            aria-label="Search database"
            onClick={() => {
              setSearchOpen((open) => !open);
              setNotificationsOpen(false);
            }}
          >
            <Search size={20} />
          </button>
          {searchOpen && (
            <div className="admin-search-popover">
              <div className="admin-search-input">
                <Search size={17} />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products, users, orders…"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={closeSearch}
                >
                  <X size={16} />
                </button>
              </div>
              {query.trim().length < 2 ? (
                <p className="popover-state">Type at least 2 characters</p>
              ) : searchError ? (
                <p className="popover-state error">{searchError}</p>
              ) : results.length ? (
                <ul className="search-results">
                  {results.map((result) => (
                    <li key={`${result.type}-${result.id}`}>
                      <button
                        type="button"
                        onClick={() => chooseResult(result)}
                      >
                        <b>{result.type}</b>
                        <span>{result.title}</span>
                        <small>{result.detail}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="popover-state">No database results found</p>
              )}
            </div>
          )}
        </div>
        <div className="topbar-popover">
          <button
            className="topbar-icon notification-button"
            type="button"
            aria-label="Order notifications"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setSearchOpen(false);
            }}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </button>
          {notificationsOpen && (
            <div className="admin-notifications">
              <div className="notification-heading">
                <b>Order notifications</b>
                {notifications.length > 0 && (
                  <button type="button" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length ? (
                <ul>
                  {notifications.map((order) => (
                    <li key={order._notificationKey || order._id}>
                      <button
                        type="button"
                        onClick={() => openNotification(order)}
                      >
                        <b>
                          {order._notificationType === "payment-paid"
                            ? `Payment received for #${String(order._id || "").slice(-8)}`
                            : `New order #${String(order._id || "").slice(-8)}`}
                        </b>
                        <span>
                          {order.userId
                            ? typeof order.userId === "object"
                              ? `${order.userId.firstName || ""} ${order.userId.lastName || ""}`.trim()
                              : order.userId
                            : "Customer"}{" "}
                          · ฿{Number(order.totalAmount || 0).toLocaleString()}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="popover-state">No new notifications</p>
              )}
            </div>
          )}
        </div>
        <div className="profile">
          <b>{user?.firstName?.[0] || "A"}</b>
          <span>
            {user?.firstName} {user?.lastName}
            <small>{user?.employeeId || "Admin"}</small>
          </span>
        </div>
      </div>
    </header>
  );
}
