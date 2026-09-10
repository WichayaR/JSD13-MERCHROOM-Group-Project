// ไฟล์: client/pages/Login.jsx
// หน้าเข้าสู่ระบบ (Sign In)
// เรียกมาจาก: App.jsx ผ่าน Route path="/login" หรือคลิกไอคอน User บน Navbar
// แหล่งข้อมูล: ฟังก์ชัน login จาก AuthContext และข้อมูลผู้ใช้ทดสอบจาก src/data/mockup/mockUsers.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { mockUsers, USER_ROLES } from '../src/data/mockup/mockUsers';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import Breadcrumb from '../src/components/ui/Breadcrumb';

// หน้าเข้าสู่ระบบ (Sign In) พร้อมปุ่มคลิกทดสอบบัญชี Demo
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ฟังก์ชันล็อกอิน: ตรวจสอบข้อมูล ถ้าผ่านให้ redirect แยกตามบทบาท (admin หรือ customer)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const authed = login(email, password);
    if (!authed) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
      return;
    }
    navigate(authed.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  };

  // Helper สำหรับกดเลือกบัญชีทดสอบแล้วกรอกอีเมล/รหัสผ่านให้อัตโนมัติ (ไว้เดโมพรีเซนต์)
  const quickFill = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  };

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Login' }]} />

      <div className="mx-auto mt-6 max-w-160">
        <div className="rounded-card bg-white p-8 md:p-10 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-pill bg-primary text-white">
              <LogIn className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase">Sign In</h1>
              <p className="text-sm text-muted">
                ล็อกอินเพื่อเข้าสู่แดชบอร์ดของคุณ (ทดสอบ mockup users_db)
              </p>
            </div>
          </div>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-ink">อีเมล</span>
              <div className="flex items-center gap-3 rounded-btn border border-ink/15 bg-cream px-4 focus-within:border-primary">
                <Mail className="size-5 shrink-0 text-muted" aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@merchroom.com"
                  className="h-12 w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-ink">รหัสผ่าน</span>
              <div className="flex items-center gap-3 rounded-btn border border-ink/15 bg-cream px-4 focus-within:border-primary">
                <Lock className="size-5 shrink-0 text-muted" aria-hidden="true" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-12 w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </label>

            {error && (
              <p className="rounded-btn bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                {error}
              </p>
            )}

            <Button type="submit" variant="dark" size="lg" className="w-full">
              <LogIn className="size-4" aria-hidden="true" />
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-ink/10" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                บัญชีทดสอบ (Testing Accounts)
              </span>
              <span className="h-px flex-1 bg-ink/10" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {mockUsers.map((u) => {
                const Icon = u.role === 'admin' ? ShieldCheck : User;
                return (
                  <button
                    key={u._id}
                    type="button"
                    onClick={() => quickFill(u)}
                    className="flex items-start gap-3 rounded-btn border border-ink/10 bg-cream p-4 text-left transition hover:border-primary hover:bg-primary/5"
                  >
                    <div
                      className={`grid size-9 shrink-0 place-items-center rounded-pill text-white ${
                        u.role === 'admin' ? 'bg-violet' : 'bg-primary'
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="truncate text-xs text-muted">{u.email}</p>
                      <span className="mt-1 inline-block rounded-pill bg-ink/5 px-2 py-0.5 text-[11px] font-bold text-ink">
                        {USER_ROLES[u.role]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-muted">
              คลิกบัญชีเพื่อเติมข้อมูลอัตโนมัติ จากนั้นกด "เข้าสู่ระบบ" — ล็อกอินเป็นแอดมินจะเข้าสู่
              Admin Dashboard / เป็นลูกค้าจะเข้าสู่ Users Dashboard
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
