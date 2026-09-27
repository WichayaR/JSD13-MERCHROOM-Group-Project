// ไฟล์: client/pages/Product.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Flag, Search, SlidersHorizontal, X } from "lucide-react";

import { getPublicProducts } from "../src/api/products.api";
import { getCategories } from "../src/api/categories.api";
import { categoryFilter, genres } from "../src/data/sections";
import { useCart } from "../src/context/CartContext";

import Container from "../src/components/ui/Container";
import ProductCard from "../src/components/ui/ProductCard";
import Breadcrumb from "../src/components/ui/Breadcrumb";

const PER_PAGE = 8;

const PRICE_OPTIONS = ["All", "< ฿1,000", "฿1,000 - ฿3,000", "> ฿3,000"];
const SIZE_OPTIONS = ["All", "S", "M", "L", "XL"];
const STATUS_OPTIONS = ["All", "In stock", "Pre-order", "Limited"];
const COLLECTION_OPTIONS = [
  "All",
  "Concert",
  "Album",
  "Character",
  "Handicraft",
];

const NATIONAL_OPTIONS = ["All", "Thailand", "International"];
const STYLE_OPTIONS = ["All", "Illustration", "Photo", "Typography"];
const MEDIUM_OPTIONS = [
  "All",
  "T-Shirt",
  "Vinyl",
  "Accessories",
  "Home & Living",
];
const SORT_OPTIONS = ["Famous", "Price: Low to High", "Price: High to Low"];

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex h-[54px] items-center justify-between gap-[10px] rounded-[9px] border border-[#A5A5A5] bg-white px-[26px] py-[15px] text-sm text-ink transition hover:border-ink"
      >
        <span className="whitespace-nowrap">
          {label}: <span className="font-medium">{value}</span>
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-14 z-50 w-48 rounded-[9px] border border-[#A5A5A5]/20 bg-white p-2 shadow-card">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full rounded-btn px-3 py-2 text-left text-sm transition hover:bg-cream ${
                option === value ? "font-semibold text-primary" : "text-ink"
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
  const cat = searchParams.get("cat");
  const q = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const selectedGenre = genres.find((item) => item.id === genre);

  const initialCategory = cat ? (categoryFilter[cat]?.label ?? "All") : "All";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [artistOptions, setArtistOptions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState(q);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState("All");
  const [size, setSize] = useState("All");
  const [status, setStatus] = useState("All");
  const [collection, setCollection] = useState("All");

  const [artist, setArtist] = useState("All");
  const [national, setNational] = useState("All");
  const [style, setStyle] = useState("All");
  const [medium, setMedium] = useState("All");
  const [thaiOnly, setThaiOnly] = useState(false);

  const [sort, setSort] = useState("Famous");
  const [page, setPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const selectedCategory = categories.find((item) => item.name === category);
  const apiFilters = useMemo(() => {
    const priceFilters =
      price === "< ฿1,000"
        ? { maxPrice: 999.99 }
        : price === "฿1,000 - ฿3,000"
          ? { minPrice: 1000, maxPrice: 3000 }
          : price === "> ฿3,000"
            ? { minPrice: 3000.01 }
            : {};
    const statusValue = {
      "In stock": "in-stock",
      "Pre-order": "pre-order",
      Limited: "limited",
    }[status];
    const sortValue = {
      "Price: Low to High": "price-asc",
      "Price: High to Low": "price-desc",
    }[sort];
    return {
      page,
      limit: PER_PAGE,
      genre,
      search: query.trim(),
      category: selectedCategory?._id,
      artistName: artist === "All" ? undefined : artist,
      national: national === "All" ? undefined : national.toLowerCase(),
      style: style === "All" ? undefined : style,
      medium: medium === "All" ? undefined : medium,
      collection: collection === "All" ? undefined : collection,
      size: size === "All" ? undefined : size,
      status: statusValue,
      thaiOnly: thaiOnly || undefined,
      sort: sortValue,
      ...priceFilters,
    };
  }, [
    page,
    genre,
    query,
    selectedCategory?._id,
    artist,
    national,
    style,
    medium,
    collection,
    size,
    status,
    thaiOnly,
    sort,
    price,
  ]);

  // Search, filters, sort, and pagination all run in MongoDB. The browser only
  // receives the current page, rather than downloading the entire catalogue.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPublicProducts(apiFilters)
      .then((res) => {
        if (cancelled) return;
        const mapped = (res.products || []).map((product) => ({
          ...product,
          id: product._id || product.id,
          brand: product.artist?.name || product.brand || "Merchroom",
          image: product.imageUrl || "",
        }));
        setProducts(mapped);
        setPagination(
          res.pagination || {
            page,
            limit: PER_PAGE,
            total: mapped.length,
            totalPages: mapped.length ? 1 : 0,
          },
        );
        setArtistOptions(res.facets?.artists || []);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setPagination({ page, limit: PER_PAGE, total: 0, totalPages: 0 });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiFilters, page]);

  // Categories are maintained by admins and shared with the storefront filter.
  useEffect(() => {
    getCategories()
      .then((res) =>
        setCategories(Array.isArray(res.categories) ? res.categories : []),
      )
      .catch(() => setCategories([]));
  }, []);

  const ARTIST_OPTIONS = useMemo(
    () => ["All", ...artistOptions],
    [artistOptions],
  );
  const CATEGORY_OPTIONS = useMemo(
    () => ["All", ...categories.map((item) => item.name)],
    [categories],
  );

  useEffect(() => {
    const selectedCategory = categories.find((item) => item.slug === cat);
    const newCategory =
      selectedCategory?.name ??
      (cat ? (categoryFilter[cat]?.label ?? "All") : "All");
    setCategory(newCategory);
    setPage(1);
  }, [cat, categories]);

  useEffect(() => {
    setQuery(q);
    setPage(1);
  }, [q]);

  const totalPages = pagination.totalPages;
  const pageItems = products;

  const chips = [];
  if (category !== "All") {
    chips.push({
      label: category,
      clear: () => {
        setCategory("All");
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("cat");
          return next;
        });
      },
    });
  }
  if (selectedGenre) {
    chips.push({
      label: selectedGenre.label,
      clear: () =>
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("genre");
          return next;
        }),
    });
  }
  if (price !== "All")
    chips.push({ label: price, clear: () => setPrice("All") });
  if (size !== "All")
    chips.push({ label: `Size: ${size}`, clear: () => setSize("All") });
  if (status !== "All")
    chips.push({ label: status, clear: () => setStatus("All") });
  if (collection !== "All")
    chips.push({ label: collection, clear: () => setCollection("All") });
  if (artist !== "All")
    chips.push({ label: artist, clear: () => setArtist("All") });
  if (national !== "All")
    chips.push({ label: national, clear: () => setNational("All") });
  if (style !== "All")
    chips.push({ label: style, clear: () => setStyle("All") });
  if (medium !== "All")
    chips.push({ label: medium, clear: () => setMedium("All") });
  if (thaiOnly)
    chips.push({ label: "Thai artist", clear: () => setThaiOnly(false) });

  const clearAll = () => {
    setCategory("All");
    setPrice("All");
    setSize("All");
    setStatus("All");
    setCollection("All");
    setArtist("All");
    setNational("All");
    setStyle("All");
    setMedium("All");
    setThaiOnly(false);
    setQuery("");
    setSort("Famous");
    setPage(1);
    setSearchParams({});
  };

  const filterLabel =
    selectedGenre?.label ??
    (cat
      ? (categories.find((item) => item.slug === cat)?.name ??
        categoryFilter[cat]?.label ??
        "Search")
      : "Search");
  const searchRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const seen = new Set();
    const results = [];
    for (const p of products) {
      const text = `${p.name} ${p.brand} ${p.description}`.toLowerCase();
      if (text.includes(q)) {
        const key = p.name;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ name: p.name, brand: p.brand });
        }
      }
      if (results.length >= 6) break;
    }
    return results;
  }, [query, products]);

  useEffect(() => {
    if (!showSuggestions) return;
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showSuggestions]);

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/products" },
          { label: filterLabel },
        ]}
      />

      <div ref={searchRef} className="relative mt-6">
        <form
          role="search"
          className="flex h-[64px] w-full items-center gap-3 rounded-full border border-[#A5A5A5] bg-white px-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuggestions(false);
          }}
        >
          <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (query.trim()) setShowSuggestions(true);
            }}
            placeholder="Search for products..."
            aria-label="ค้นหาสินค้า"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && suggestions.length > 0}
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul
            className="absolute left-0 top-full z-50 mt-2 w-full rounded-[18px] border border-[#A5A5A5]/20 bg-white p-2 shadow-card"
            role="listbox"
          >
            {suggestions.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  role="option"
                  onClick={() => {
                    setQuery(s.name);
                    setPage(1);
                    setShowSuggestions(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-btn px-3 py-2 text-left text-sm transition hover:bg-cream"
                >
                  <Search
                    className="size-4 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium text-ink">
                    {s.name}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-muted">
                    {s.brand}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border-b border-[#A5A5A5]/30 pb-2">
        <div className="flex w-[80px] flex-col items-center gap-1.5">
          <span className="text-base font-semibold text-violet">Product</span>
          <span className="h-1 w-full rounded-full bg-violet" />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsMobileFiltersOpen(true)}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[9px] border border-ink bg-white text-sm font-semibold text-ink md:hidden"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filter products
        {chips.length > 0 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
            {chips.length}
          </span>
        )}
      </button>

      {isMobileFiltersOpen && (
        <button
          type="button"
          aria-label="ปิดตัวกรอง"
          onClick={() => setIsMobileFiltersOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
        />
      )}
      <div
        className={`${isMobileFiltersOpen ? "fixed inset-x-3 bottom-3 top-3 z-50 block overflow-y-auto" : "hidden"} rounded-[18px] border border-[#A5A5A5] bg-white px-5 py-6 shadow-xl md:relative md:mt-6 md:block md:overflow-visible md:px-[80px] md:py-[40px] md:shadow-none`}
      >
        <div className="mb-5 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-bold">Filter products</h2>
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(false)}
            className="grid size-9 place-items-center rounded-full bg-cream"
            aria-label="ปิดตัวกรอง"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="relative z-20">
          <p className="text-xs font-normal text-muted">Sort by Product</p>
          <div className="mt-3 flex flex-wrap gap-[10px]">
            <Dropdown
              label="Category"
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={(v) => {
                setCategory(v);
                setPage(1);
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  if (v === "All") {
                    next.delete("cat");
                  } else {
                    const selectedCategory = categories.find(
                      (item) => item.name === v,
                    );
                    const legacyKey = Object.keys(categoryFilter).find(
                      (key) => categoryFilter[key].label === v,
                    );
                    if (selectedCategory?.slug)
                      next.set("cat", selectedCategory.slug);
                    else if (legacyKey) next.set("cat", legacyKey);
                    else next.delete("cat");
                  }
                  return next;
                });
              }}
            />
            <Dropdown
              label="Price"
              value={price}
              options={PRICE_OPTIONS}
              onChange={(v) => {
                setPrice(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="Size"
              value={size}
              options={SIZE_OPTIONS}
              onChange={(v) => {
                setSize(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="Collection"
              value={collection}
              options={COLLECTION_OPTIONS}
              onChange={(v) => {
                setCollection(v);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="relative z-10 mt-[25px]">
          <p className="text-xs font-normal text-muted">
            Sort By Artist and Culture
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-[10px]">
            <Dropdown
              label="Artist/Company"
              value={artist}
              options={ARTIST_OPTIONS}
              onChange={(v) => {
                setArtist(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="National"
              value={national}
              options={NATIONAL_OPTIONS}
              onChange={(v) => {
                setNational(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="Style"
              value={style}
              options={STYLE_OPTIONS}
              onChange={(v) => {
                setStyle(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="Medium"
              value={medium}
              options={MEDIUM_OPTIONS}
              onChange={(v) => {
                setMedium(v);
                setPage(1);
              }}
            />

            <button
              type="button"
              onClick={() => {
                setThaiOnly(!thaiOnly);
                setPage(1);
              }}
              aria-pressed={thaiOnly}
              className={`inline-flex h-[54px] items-center gap-2 rounded-[9px] border px-[26px] py-[15px] text-sm font-medium transition ${
                thaiOnly
                  ? "border-[#FF5533] bg-[#FF5533] text-white"
                  : "border-[#FF5533] bg-white text-[#FF5533] hover:bg-[#FF5533]/5"
              }`}
            >
              <Flag className="size-4 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">Thai Artist Only</span>
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(false)}
          className="mt-6 h-11 w-full rounded-full bg-primary text-sm font-semibold text-white md:hidden"
        >
          Show products
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.clear}
              aria-label={`ลบ filter ${chip.label}`}
              className="inline-flex h-[42px] items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80"
            >
              {chip.label}
              <X className="size-4" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-6">
          {chips.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-normal text-[#A5A5A5] underline underline-offset-4 transition hover:text-ink"
            >
              Clear All
            </button>
          )}

          <Dropdown
            label="Sort By"
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
          />
        </div>
      </div>

      {!loading && (
        <div className="mt-8 flex items-center justify-between gap-3 text-xs text-muted sm:text-sm">
          <span>
            {pagination.total
              ? `Showing ${(pagination.page - 1) * pagination.limit + 1}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} products`
              : "0 products"}
          </span>
          <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-medium text-ink/70 sm:text-xs">
            Database pagination
          </span>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {loading && (
          <p className="col-span-full py-16 text-center text-muted">
            Loading products...
          </p>
        )}
        {!loading &&
          pageItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              fluid
            />
          ))}

        {!loading && pageItems.length === 0 && (
          <p className="col-span-full py-16 text-center text-muted">
            ไม่พบสินค้าที่ตรงกับ filter — ลองปรับตัวเลือกดูนะ
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-2"
          aria-label="แบ่งหน้าสินค้า"
        >
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                aria-current={page === num ? "page" : undefined}
                className={`grid size-8 place-items-center rounded-pill text-sm transition ${
                  page === num
                    ? "bg-violet font-semibold text-white"
                    : "text-ink hover:bg-cream"
                }`}
              >
                {num}
              </button>
            ),
          )}
        </nav>
      )}
    </Container>
  );
}
