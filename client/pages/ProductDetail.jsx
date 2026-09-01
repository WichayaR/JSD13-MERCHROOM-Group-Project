import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  Check,
  ChevronsUpDown,
  Minus,
  PenLine,
  Plus,
  Star,
} from 'lucide-react';
import { products } from '../src/data/product';
import { mockReviews } from '../src/data/reviews';
import { categoryFilter } from '../src/data/sections';
import { useCart } from '../src/context/CartContext';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import ProductCard from '../src/components/ui/ProductCard';
import Breadcrumb from '../src/components/ui/Breadcrumb';

const SIZES = ['Small', 'Medium', 'Large', 'X-large'];

const COLORS = [
  { id: 'black', label: 'Black', className: 'bg-ink' },
  { id: 'white', label: 'White', className: 'border border-ink/20 bg-white' },
  { id: 'sand', label: 'Sand', className: 'bg-muted' },
];

const TABS = [
  { id: 'details', label: 'Product details' },
  { id: 'reviews', label: 'Rating & Reviews' },
  { id: 'faqs', label: 'FAQs' },
];

const FAQS = [
  {
    q: 'สินค้าจัดส่งในกี่วัน?',
    a: 'สินค้าพร้อมส่งจัดส่งภายใน 1-3 วันทำการ ส่วนสินค้าพรีออเดอร์ขึ้นอยู่กับกำหนดของแต่ละรายการ ตามที่ระบุในหน้าสินค้า',
  },
  {
    q: 'สินค้าสามารถเปลี่ยน/คืนได้ไหม?',
    a: 'เปลี่ยนไซซ์ได้ภายใน 7 วันนับจากวันที่ได้รับสินค้า โดยสินค้าต้องอยู่ในสภาพสมบูรณ์พร้อมป้าย ส่วนสินค้าพรีออเดอร์และสินค้าลิมิเต็ดไม่รับคืน',
  },
  {
    q: 'สินค้าเป็นของแท้จากศิลปินหรือไม่?',
    a: 'สินค้าทุกชิ้นบน MERCHROOM มาจากศิลปิน แบนด์ และผู้ผลิตที่ได้รับลิขสิทธิ์โดยตรง เราตรวจสอบต้นทางทุกชิ้นก่อนขึ้นขาย',
  },
];

const baht = (value) => `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((item) => String(item.id) === String(productId));
  const backToCat = (() => {
    if (!product) return null;
    if (product.id.endsWith('th')) return 'thai-band';
    if (product.id.endsWith('en')) return 'pop-culture';
    if (product.id.endsWith('hr')) return 'thai-heritage';
    return null;
  })();
  const backTo = backToCat ? `/products?cat=${backToCat}` : '/products';
  const categoryLabel = backToCat ? categoryFilter[backToCat]?.label : 'Products';

  const [size, setSize] = useState('Large');
  const [color, setColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews');
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="mb-6 text-xl font-semibold text-error">ไม่พบสินค้าที่คุณค้นหา</h1>
        <Button onClick={() => navigate('/products')}>กลับไปหน้าสินค้า</Button>
      </Container>
    );
  }

  const sameBrand = products.filter((item) => item.brand === product.brand);
  const gallery = [product, ...sameBrand.filter((item) => item.id !== product.id)].slice(0, 3);
  const mainImage = gallery[galleryIndex]?.image || product.image;

  const related = [
    ...sameBrand.filter((item) => item.id !== product.id),
    ...products.filter(
      (item) => item.id !== product.id && item.brand !== product.brand && item.id.endsWith(product.id.slice(-2)),
    ),
  ].slice(0, 4);

  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: categoryLabel, to: backTo },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {gallery.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGalleryIndex(idx)}
                aria-label={`ดูรูป ${item.name}`}
                aria-pressed={idx === galleryIndex}
                className={`size-20 overflow-hidden rounded-btn border-2 bg-white transition ${
                  idx === galleryIndex ? 'border-ink' : 'border-transparent hover:border-ink/20'
                }`}
              >
                {item.image && (
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden rounded-btn bg-white">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-muted">
                ไม่มีรูปสินค้า
              </div>
            )}
          </div>
        </div>

        <div>
          {product.brand && (
            <p className="text-base font-semibold uppercase text-primary">{product.brand}</p>
          )}

          <h1 className="mt-2 text-2xl font-bold leading-snug md:text-[28px]">{product.name}</h1>

          <p className="mt-3 font-[Sarabun] text-2xl font-medium">
            {baht(product.price)}
          </p>

          <p className="mt-4 pb-6 text-sm leading-relaxed text-black/70 border-b border-ink/10">
            {product.description}
          </p>

          <div className="mt-6">
            <p className="text-sm font-semibold">Choose Colors</p>
            <div className="mt-3 flex gap-3">
              {COLORS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setColor(option.id)}
                  aria-label={option.label}
                  aria-pressed={color === option.id}
                  className={`grid size-7 place-items-center rounded-pill transition ${
                    color === option.id ? 'ring-2 ring-ink ring-offset-2' : 'hover:ring-2 hover:ring-ink/30 hover:ring-offset-2'
                  } ${option.className}`}
                >
                  {color === option.id && <Check className="size-4 text-white" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Choose Size</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {SIZES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  aria-pressed={size === option}
                  className={`h-10 rounded-pill border px-6 text-sm transition ${
                    size === option
                      ? 'border-primary bg-primary font-medium text-white'
                      : 'border-ink/20 text-ink hover:border-ink'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex h-btn-lg items-center gap-5 rounded-pill border border-ink/20 px-5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="ลดจำนวน"
                className="text-muted transition hover:text-ink"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-4 text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="เพิ่มจำนวน"
                className="text-muted transition hover:text-ink"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              onClick={() => addToCart(product, quantity)}
              aria-label={`เพิ่ม ${product.name} จำนวน ${quantity} ชิ้นลงตะกร้า`}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16 border-b border-ink/10">
        <div role="tablist" aria-label="ข้อมูลสินค้า" className="flex">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 pb-4 text-center text-sm transition md:text-base ${
                  isActive
                    ? 'border-b-2 border-ink font-semibold text-ink'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'details' && (
        <div className="mt-10 max-w-3xl">
          <p className="leading-relaxed text-black/70">{product.description}</p>
          <p className="mt-4 text-sm text-muted">
            หมวด: {categoryLabel} · แบรนด์: {product.brand}
          </p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold">All Reviews ({mockReviews.length})</h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-pill border border-ink/15 px-4 text-sm"
              >
                Latest
                <ChevronsUpDown className="size-4" aria-hidden="true" />
              </button>
              <Button variant="highlight" size="md">
                <PenLine className="size-4" aria-hidden="true" />
                Write a Review
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {mockReviews.map((review) => (
              <article key={review.id} className="rounded-card bg-white p-6">
                <div className="flex gap-1" aria-label={`คะแนน ${review.rating} จาก 5`}>
                  {Array.from({ length: 5 }, (_, idx) => (
                    <Star
                      key={idx}
                      className={`size-4 ${
                        idx < review.rating ? 'fill-warning text-warning' : 'text-muted/40'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-sm font-bold">{review.name}</span>
                  {review.verified && (
                    <BadgeCheck
                      className="size-4 text-success"
                      aria-label="ผู้ซื้อที่ยืนยันแล้ว"
                    />
                  )}
                </div>

                <p className="mt-2 text-sm leading-relaxed text-black/70">{review.text}</p>

                <p className="mt-3 text-xs text-muted">Posted on {review.date}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'faqs' && (
        <div className="mt-10 flex max-w-3xl flex-col gap-6">
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <h3 className="text-base font-semibold">{faq.q}</h3>
              <p className="mt-1 text-sm leading-relaxed text-black/70">{faq.a}</p>
            </div>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-24" aria-label="สินค้าที่คุณอาจสนใจ">
          <h2 className="text-center text-3xl font-bold md:text-4xl">You might also like</h2>

          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} compact />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
