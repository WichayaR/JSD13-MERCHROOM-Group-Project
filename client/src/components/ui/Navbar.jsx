// ไฟล์: client/src/components/ui/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Key, LogOut, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const navLinks = [
  { label: 'Pop Culture', to: '/pop-culture' },
  { label: 'Thai Heritage', to: '/thai-heritage' },
  { label: 'About Us', to: '/about' },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // ตรวจจับการ Scroll หน้าจอ
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseMenu = () => {
    setIsUserMenuOpen(false);
  };

  const isHomePage = pathname === '/';
  const onHero = isHomePage && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex h-19 items-center transition-all duration-300 ${
        isHomePage
          ? onHero
            ? 'bg-navbar-gradient text-white'
            : 'bg-navbar-gradient-fade backdrop-blur-lg text-white'
          : 'bg-ink text-white'
      }`}
    >
      {/* Container หลัก: max-w-330 สูง h-12 ตรงตาม Figma */}
      <div className="mx-auto flex h-12 w-full max-w-330 items-center justify-between gap-4 px-4 xl:gap-19.5 xl:px-0">
        
        {/* ฝั่งซ้าย: โลโก้ + เมนูหลัก */}
        <div className="flex items-center gap-6 xl:gap-19.5">
          <Link to="/" className="flex shrink-0 items-center">
            <div className="w-35 shrink-0 md:w-38.75">
              <Logo />
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `whitespace-nowrap transition hover:text-highlight hover:underline hover:decoration-highlight hover:decoration-[3px] hover:underline-offset-8 ${
                    isActive
                      ? 'font-semibold text-highlight underline decoration-highlight decoration-[3px] underline-offset-8'
                      : 'text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ฝั่งขวา: Search Bar + Cart + User */}
        <div className="flex flex-1 items-center justify-end gap-6 xl:gap-19.5">
          {/* ช่อง Search Bar ความสูง h-12 */}
          <form
            className="hidden h-12 w-full max-w-107.75 items-center gap-3 rounded-full bg-[#F0F0F0]/70 px-5 text-black sm:flex"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products');
            }}
          >
            <Search className="size-5 shrink-0 text-black/40" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              aria-label="ค้นหาสินค้า"
              className="w-full bg-transparent text-sm text-black placeholder:text-black/40 focus:outline-none"
            />
          </form>

          {/* กลุ่มไอคอน Actions */}
          <div className="flex shrink-0 items-center gap-5 md:gap-6">
            <Link to="/cart" className="relative text-white transition hover:opacity-80" aria-label="ตะกร้าสินค้า">
              <ShoppingCart className="size-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ปุ่ม User & Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center justify-center text-white transition hover:opacity-80 focus:outline-none"
                aria-label="เปิดเมนูผู้ใช้งาน"
                aria-expanded={isUserMenuOpen}
              >
                <User className="size-6" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl bg-white p-1 text-zinc-700 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
                  {!isAuthenticated ? (
                    <div className="divide-y divide-zinc-100">
                      <Link
                        to="/login"
                        onClick={handleCloseMenu}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 md:text-sm"
                      >
                        <User className="size-4 text-zinc-500" />
                        <span>Log in / Registration</span>
                      </Link>

                      <Link
                        to="/admin/login"
                        onClick={handleCloseMenu}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 md:text-sm"
                      >
                        <Key className="size-4 text-zinc-500" />
                        <span>Admin Gateway</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      <Link
                        to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                        onClick={handleCloseMenu}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 md:text-sm"
                      >
                        <User className="size-4 text-zinc-500" />
                        <span>Dashboard ({user?.name || 'Account'})</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          logout?.();
                          handleCloseMenu();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-red-600 transition hover:bg-red-50 md:text-sm"
                      >
                        <LogOut className="size-4 text-red-500" />
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}