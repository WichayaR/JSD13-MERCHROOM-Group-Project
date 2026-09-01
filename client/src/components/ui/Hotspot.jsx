import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hotspot({ product }) {
  if (!product) return null;

  return (
    <Link
      to={`/productDetail/${product.id}`}
      className="block w-36.5 rounded-[18px] bg-white/25 p-3 shadow-xl ring-1 ring-white/50 backdrop-blur-md"
      aria-label={`ดูสินค้า ${product.name}`}
    >
      <div className="h-28.25 w-full overflow-hidden rounded-[9px] bg-cream/60">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/80">
            ไม่มีรูป
          </div>
        )}
      </div>

      <p className="mt-2 line-clamp-1 text-xs font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
        {product.name}
      </p>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="font-[Sarabun] text-sm font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
          ฿{Number(product.price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
        </span>
        <span className="grid size-6 place-items-center rounded-pill bg-primary text-white">
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
