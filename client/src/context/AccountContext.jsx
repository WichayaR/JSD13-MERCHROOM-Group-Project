// src/context/AccountContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getMyProfile, updateMyProfileDetails } from '../api/users.api';
import { getMyOrders } from '../api/orders.api';
import { useAuth } from './AuthContext';

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const { user, booting, updateCurrentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (booting) return () => { isMounted = false; };
    if (!user) {
      return () => { isMounted = false; };
    }
    async function loadAccountData() {
      try {
        const [userData, ordersData] = await Promise.all([
          getMyProfile(),
          getMyOrders(),
        ]);
        if (isMounted) {
          setProfile(userData.user);
          setOrders(ordersData.orders || []);
          setError('');
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'ไม่สามารถโหลดข้อมูลบัญชีได้');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAccountData();
    return () => {
      isMounted = false;
    };
  }, [user, booting]);

  const updateProfile = async (fields) => {
    const { user: updated } = await updateMyProfileDetails(fields);
    setProfile(updated);
    updateCurrentUser(updated);
    return updated;
  };

  const uploadAvatar = async () => {
    // The backend accepts a URL only; binary upload has no server endpoint yet.
    throw new Error('ระบบอัปโหลดรูปโปรไฟล์ยังไม่มี endpoint บน server');
  };

  const orderCount = useMemo(() => orders.length, [orders]);

  const totalSpent = useMemo(() => {
    return orders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }, [orders]);

  return (
    <AccountContext.Provider
      value={{
        profile,
        orders,
        loading,
        error,
        updateProfile,
        uploadAvatar,
        orderCount,
        totalSpent,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
