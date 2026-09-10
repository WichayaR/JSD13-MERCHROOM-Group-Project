// ไฟล์: client/src/context/AuthContext.jsx
// Context จัดการสถานะ Authentication และสิทธิ์ผู้ใช้งาน (Admin / Customer)
// เรียกมาจาก: App.jsx (นำ AuthProvider ไปครอบทั้งแอป)
// แหล่งข้อมูลผู้ใช้: src/data/mockup/mockUsers.js และจัดเก็บ session ผ่าน src/utils/sessionStorage.js
// ส่งออก Hook: useAuth() สำหรับหน้า Login, Navbar, UserDashboard, AdminDashboard
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
  // ดึง session จาก storage มาตั้งเป็น user เริ่มต้น
  const [user, setUser] = useState(() => getSession());

  // ตรวจสอบอีเมล/รหัสผ่านกับ mock database ถ้าผ่านจะจำ session ไว้
  const login = (email, password) => {
    const authed = authenticate(email, password);
    if (authed) {
      saveSession(authed);
      setUser(authed);
      return authed;
    }
    return null;
  };

  // ล้าง session และเคลียร์ state ออกตอน logout
  const logout = () => {
    clearSession();
    setUser(null);
  };

  // อัปเดตข้อมูล user ใหม่ (เช่น ตอนแก้โปรไฟล์) และตัด password ทิ้งก่อนบันทึกลง session
  const refreshUser = (userId) => {
    const fresh = getUserById(userId);
    if (fresh) {
      const safeUser = { ...fresh };
      delete safeUser.password;
      saveSession(safeUser);
      setUser(safeUser);
    }
  };

  // รวม state และ helper สำหรับเช็คสิทธิ์ (Admin / Customer) ให้เรียกใช้ง่ายๆ
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

// Custom hook สำหรับดึง context การล็อกอินไปใช้ในหน้าอื่นๆ
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
