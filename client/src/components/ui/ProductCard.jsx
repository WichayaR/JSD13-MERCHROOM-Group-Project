import { Link } from 'react-router-dom';
import Button from './Button';

const baht = (value) =>
  `฿${Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

export default function ProductCard({
  product,
  onAddToCart,
  fluid = false,
  compact = false,
}) {
  if (!product) return null;

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-card bg-white p-4 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
        fluid ? 'w-full' : compact ? 'w-full' : 'w-70 sm:w-73.75'
      }`}
    >
      <Link
        to={`/productDetail/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden rounded-btn bg-cream"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            ไม่มีรูปสินค้า
          </div>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {product.brand && (
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {product.brand}
          </p>
        )}
        <Link
          to={`/productDetail/${product.id}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-ink transition hover:text-primary"
          title={product.name}
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3">
          <span className="font-[Sarabun] text-base font-bold text-ink md:text-lg">
            {baht(product.price)}
          </span>

          {onAddToCart && !compact && (
            <Button size="md" className="mt-2.5 w-full" onClick={() => onAddToCart(product, 1)}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
