import { Link, NavLink } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './ui/Logo';

const navLinks = [
  { label: 'Pop Culture', to: '/pop-culture' },
  { label: 'Thai Heritage', to: '/thai-heritage' },
  { label: 'News', to: '/news' },
  { label: 'About Us', to: '/about' },
];

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="bg-brand-gradient sticky top-0 z-50 h-navbar text-white">
      {/* navbar */}
      <div className="flex h-full w-full items-center gap-6 px-6 lg:gap-19.5 lg:px-15">
        <Logo />

        {/* บล็อกเมนู */}
        <nav className="hidden items-center gap-6 lg:flex lg:w-106.75 lg:justify-between">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                /* hover/active = ตัวอักษร + เส้นขีดใต้สีเหลืองไฮไลต์  */
                `transition hover:text-highlight hover:underline hover:decoration-highlight hover:decoration-[3px] hover:underline-offset-8 ${
                  isActive
                    ? 'text-highlight underline decoration-highlight decoration-[3px] underline-offset-8'
                    : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form
          className="ml-auto hidden h-12 w-107.75 items-center gap-3 rounded-pill bg-white/60 px-4 md:flex lg:ml-0"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="size-5 shrink-0 text-black/40" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search for products..."
            aria-label="ค้นหาสินค้า"
            className="w-full bg-transparent text-black placeholder:text-black/40 focus:outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-6 md:ml-0 lg:ml-auto">
          <Link to="/cart" className="relative transition hover:opacity-80" aria-label="ตะกร้าสินค้า">
            <ShoppingCart className="size-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-pill bg-primary text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button type="button" className="transition hover:opacity-80" aria-label="บัญชีผู้ใช้">
            <User className="size-6" />
          </button>
        </div>
      </div>
    </header>
  );
}