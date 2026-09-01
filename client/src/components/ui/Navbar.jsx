import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Logo from './Logo';

const navLinks = [
  { label: 'Pop Culture', to: '/pop-culture' },
  { label: 'Thai Heritage', to: '/thai-heritage' },
  { label: 'News', to: '/news' },
  { label: 'About Us', to: '/about' },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onHero = pathname === '/' && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-navbar text-white transition-all duration-300 ${
        onHero ? 'bg-navbar-gradient' : 'bg-navbar-gradient-fade backdrop-blur-lg'
      }`}
    >
      <div className="flex h-full w-full items-center gap-6 px-6 lg:gap-19.5 lg:px-15">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex lg:w-106.75 lg:justify-between">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
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
          className="ml-auto hidden h-11 w-107.75 items-center gap-3 rounded-pill bg-white/60 px-4 md:flex lg:ml-0"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products');
          }}
        >
          <Search className="size-5 shrink-0 text-ink/60" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            aria-label="ค้นหาสินค้า"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/50 focus:outline-none"
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
