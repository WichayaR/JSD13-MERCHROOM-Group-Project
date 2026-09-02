import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Flag, Search, X } from 'lucide-react';
import { products } from '../src/data/product';
import { categoryFilter } from '../src/data/sections';
import { useCart } from '../src/context/CartContext';
import Container from '../src/components/ui/Container';
import ProductCard from '../src/components/ui/ProductCard';
import Breadcrumb from '../src/components/ui/Breadcrumb';

const PER_PAGE = 8;

const CATEGORY_SUFFIX = { 'Thai Band': 'th', 'Pop Culture': 'en', Movie: 'en', 'Thai Heritage': 'hr', Artist: null };
const CATEGORY_OPTIONS = ['All', ...Object.keys(CATEGORY_SUFFIX)];
const PRICE_OPTIONS = ['All', '< ฿1,000', '฿1,000 - ฿3,000', '> ฿3,000'];
const SIZE_OPTIONS = ['All', 'S', 'M', 'L', 'XL'];
const STATUS_OPTIONS = ['All', 'In stock', 'Pre-order', 'Limited'];
const COLLECTION_OPTIONS = ['All', 'Concert', 'Album', 'Character', 'Handicraft'];
const BRANDS = [...new Set(products.map((product) => product.brand).filter(Boolean))];
const ARTIST_OPTIONS = ['All', ...BRANDS];
const NATIONAL_OPTIONS = ['All', 'Thailand', 'International'];
const STYLE_OPTIONS = ['All', 'Illustration', 'Photo', 'Typography'];
const MEDIUM_OPTIONS = ['All', 'T-Shirt', 'Vinyl', 'Accessories', 'Home & Living'];
const SORT_OPTIONS = ['Famous', 'Price: Low to High', 'Price: High to Low'];

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-pill border border-ink/15 bg-white px-4 text-sm text-ink transition hover:border-ink"
      >
        {label}: <span className="font-medium">{value}</span>
        <ChevronDown className="size-4 text-muted" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-20 w-48 rounded-card bg-white p-2 shadow-card">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full rounded-btn px-3 py-2 text-left text-sm transition hover:bg-cream ${
                option === value ? 'font-semibold text-primary' : 'text-ink'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Products() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const cat = searchParams.get('cat');
  const q = searchParams.get('q') ?? '';

  const [tab, setTab] = useState('product');
  const [query, setQuery] = useState(q);
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState('All');
  const [artist, setArtist] = useState('All');
  const [thaiOnly, setThaiOnly] = useState(false);
  const [sort, setSort] = useState('Famous');
  const [page, setPage] = useState(1);

  const [prevCat, setPrevCat] = useState(cat);
  if (cat !== prevCat) {
    setPrevCat(cat);
    setCategory(cat ? (categoryFilter[cat]?.label ?? 'All') : 'All');
    setPage(1);
  }

  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setQuery(q);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const suffix = category !== 'All' ? CATEGORY_SUFFIX[category] : null;
    let result = products.filter((product) => {
      if (suffix && !product.id.endsWith(suffix)) return false;
      if (thaiOnly && !product.id.endsWith('th')) return false;
      if (artist !== 'All' && product.brand !== artist) return false;
      if (price === '< ฿1,000' && product.price >= 1000) return false;
      if (price === '฿1,000 - ฿3,000' && (product.price < 1000 || product.price > 3000)) return false;
      if (price === '> ฿3,000' && product.price <= 3000) return false;
      const text = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;
      return true;
    });

    if (sort === 'Price: Low to High') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, thaiOnly, artist, price, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const chips = [];
  if (category !== 'All') chips.push({ label: category, clear: () => setCategory('All') });
  if (price !== 'All') chips.push({ label: price, clear: () => setPrice('All') });
  if (artist !== 'All') chips.push({ label: artist, clear: () => setArtist('All') });
  if (thaiOnly) chips.push({ label: 'Thai artist', clear: () => setThaiOnly(false) });

  const clearAll = () => {
    setCategory('All');
    setPrice('All');
    setArtist('All');
    setThaiOnly(false);
    setQuery('');
    setSort('Famous');
    setPage(1);
    if (cat) setSearchParams({});
  };

  const filterLabel = cat ? (categoryFilter[cat]?.label ?? 'Search') : 'Search';

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/products' }, { label: filterLabel }]}
      />

      <form
        role="search"
        className="mt-6 flex h-13 items-center gap-3 rounded-pill bg-white px-5 shadow-card"
        onSubmit={(e) => e.preventDefault()}
      >
        <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search for products..."
          aria-label="ค้นหาสินค้า"
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </form>

      <div className="mt-8 flex gap-10" role="tablist" aria-label="เลือกมุมมองร้านค้า">
        {[
          { id: 'product', label: 'Product' },
          { id: 'artist', label: 'Artist' },
        ].map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className="flex w-20 flex-col items-center gap-1.5"
            >
              <span className={`text-sm transition ${isActive ? 'font-semibold text-ink' : 'text-muted'}`}>
                {item.label}
              </span>
              <span className={`h-1 w-full rounded-pill transition ${isActive ? 'bg-violet' : 'bg-transparent'}`} />
            </button>
          );
        })}
      </div>

      {tab === 'artist' ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((brand) => {
            const count = products.filter((product) => product.brand === brand).length;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => {
                  setArtist(brand);
                  setTab('product');
                }}
                className="rounded-card bg-white p-8 text-left shadow-card transition hover:-translate-y-1"
              >
                <p className="font-display text-lg font-bold uppercase">{brand}</p>
                <p className="mt-1 text-sm text-muted">{count} ชิ้นงาน</p>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-card bg-white p-5 md:p-6">
            <p className="text-xs text-muted">Sort by Product</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Dropdown label="Category" value={category} options={CATEGORY_OPTIONS} onChange={(v) => { setCategory(v); setPage(1); }} />
              <Dropdown label="Price" value={price} options={PRICE_OPTIONS} onChange={(v) => { setPrice(v); setPage(1); }} />
              <Dropdown label="Size" value="All" options={SIZE_OPTIONS} onChange={() => {}} />
              <Dropdown label="Status" value="All" options={STATUS_OPTIONS} onChange={() => {}} />
              <Dropdown label="Collection" value="All" options={COLLECTION_OPTIONS} onChange={() => {}} />
            </div>

            <p className="mt-5 text-xs text-muted">Sort by Artist and Culture</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Dropdown label="Artist/Company" value={artist} options={ARTIST_OPTIONS} onChange={(v) => { setArtist(v); setPage(1); }} />
              <Dropdown label="National" value="All" options={NATIONAL_OPTIONS} onChange={() => {}} />
              <Dropdown label="Style" value="All" options={STYLE_OPTIONS} onChange={() => {}} />
              <Dropdown label="Medium" value="All" options={MEDIUM_OPTIONS} onChange={() => {}} />

              <button
                type="button"
                onClick={() => {
                  setThaiOnly(!thaiOnly);
                  setPage(1);
                }}
                aria-pressed={thaiOnly}
                className={`inline-flex h-10 items-center gap-2 rounded-pill border px-4 text-sm transition ${
                  thaiOnly ? 'border-primary bg-primary text-white' : 'border-primary/40 bg-white text-primary hover:border-primary'
                }`}
              >
                <Flag className="size-4" aria-hidden="true" />
                Thai artist Only
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.clear}
                  aria-label={`ลบ filter ${chip.label}`}
                  className="inline-flex h-9 items-center gap-2 rounded-pill bg-ink px-4 text-sm text-cream-text transition hover:bg-ink/90"
                >
                  {chip.label}
                  <X className="size-4" aria-hidden="true" />
                </button>
              ))}
              {chips.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm text-muted underline underline-offset-4 transition hover:text-ink"
                >
                  Clear All
                </button>
              )}
            </div>

            <Dropdown label="Sort by" value={sort} options={SORT_OPTIONS} onChange={setSort} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {pageItems.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} fluid />
            ))}
            {pageItems.length === 0 && (
              <p className="col-span-full py-16 text-center text-muted">
                ไม่พบสินค้าที่ตรงกับ filter — ลองดึงตัวเลือกออกดูนะ
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="แบ่งหน้าสินค้า">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  aria-current={page === num ? 'page' : undefined}
                  className={`grid size-8 place-items-center rounded-pill text-sm transition ${
                    page === num ? 'bg-violet font-semibold text-white' : 'text-ink hover:bg-cream'
                  }`}
                >
                  {num}
                </button>
              ))}
            </nav>
          )}

          <section className="mt-20">
            <h2 className="text-2xl font-bold leading-snug md:text-3xl">
              มาใหม่ + สินค้าที่คุณอาจสนใจ
              <br />
              รวม 296+406 ชิ้นงาน card you might like
            </h2>
          </section>
        </>
      )}
    </Container>
  );
}
