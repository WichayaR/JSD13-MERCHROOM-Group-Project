import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  saveSession,
  getSession,
  clearSession,
} from '../utils/sessionStorage';
import { registerApi, loginApi, logoutApi, checkAuthApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ดึง session เริ่มต้นจาก sessionStorage (ถ้ามี)
  const [user, setUser] = useState(() => getSession());

  // booting = ช่วงเปิดเว็บที่กำลังถาม server ว่า login ค้างไว้ไหม
  // ระหว่างรอ user ยังเป็น null อยู่ ProtectedRoute ต้องรอก่อน ไม่งั้นเด้ง /login ทั้งที่ login ไว้แล้ว
  const [booting, setBooting] = useState(true);

  // ตรวจสอบ authentication session กับเซิร์ฟเวอร์ backend เมื่อ mount
  useEffect(() => {
    checkAuthApi()
      .then((result) => {
        if (result.success && result.user) {
          saveSession(result.user);
          setUser(result.user);
        } else {
          clearSession();
          setUser(null);
        }
      })
      .catch(() => {
        // Do not trust a stale browser session when the server cannot validate its cookie.
        clearSession();
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, []);

  // Authentication must come from the API so protected data always passes server middleware.
  const login = useCallback(async (email, password) => {
    try {
      const apiResult = await loginApi(email, password);
      if (apiResult.success && apiResult.user) {
        saveSession(apiResult.user);
        setUser(apiResult.user);
      }
      return apiResult;
    } catch {
      return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ในขณะนี้' };
    }
  }, []);

  // ฟังก์ชัน register: สมัครสมาชิกผ่าน backend API
  const register = useCallback(async ({ username, email, password, phone }) => {
    return await registerApi({
      email,
      password,
      firstName: username || '',
      phone: phone || '',
    });
  }, []);

  // ฟังก์ชัน logout: แจ้ง backend และล้าง session ในเครื่อง
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    clearSession();
    setUser(null);
  }, []);

  // ฟังก์ชันรีเซ็ตรหัสผ่าน (mock endpoint)
  const resetPassword = useCallback(() => {
    return { success: true, message: 'Password updated successfully' };
  }, []);

  const updateCurrentUser = useCallback((updatedUser) => {
    saveSession(updatedUser);
    setUser(updatedUser);
  }, []);

  // รวม state และ helper สำหรับเช็คสิทธิ์ (Admin / Customer) ให้เรียกใช้ง่ายๆ
  // isLoggedIn = ชื่อเรียกตรงตัวสำหรับ ProtectedRoute (ค่าเดียวกับ isAuthenticated)
  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      booting,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user && user.role === 'admin'),
      isCustomer: Boolean(user && user.role === 'customer'),
      login,
      register,
      logout,
      resetPassword,
      updateCurrentUser,
    }),
    [user, booting, login, register, logout, resetPassword, updateCurrentUser],
  );

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
