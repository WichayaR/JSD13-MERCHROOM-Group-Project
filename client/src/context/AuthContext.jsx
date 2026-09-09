// Context จัดการสถานะการล็อกอิน (session) ของ mockup users_db ให้ทุกหน้าเข้าถึงได้
import { createContext, useContext, useState } from 'react';
import {
  authenticate,
  getUsers,
  getUserById,
} from '../data/mockup/mockUsers';
import {
  saveSession,
  getSession,
  clearSession,
} from '../utils/sessionStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  const login = (email, password) => {
    const authed = authenticate(email, password);
    if (authed) {
      saveSession(authed);
      setUser(authed);
      return authed;
    }
    return null;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const refreshUser = (userId) => {
    const fresh = getUserById(userId);
    if (fresh) {
      const safeUser = { ...fresh };
      delete safeUser.password;
      saveSession(safeUser);
      setUser(safeUser);
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user && user.role === 'admin'),
    isCustomer: Boolean(user && user.role === 'customer'),
    users: getUsers(),
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
