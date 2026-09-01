import { Link, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { products } from '../src/data/product';
import { categoryFilter } from '../src/data/sections';
import { useCart } from '../src/context/CartContext';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import ProductCard from '../src/components/ui/ProductCard';
import SectionHeading from '../src/components/ui/SectionHeading';

export default function Products() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const cat = searchParams.get('cat');
  const filter = cat ? categoryFilter[cat] : null;

  let visible = products;
  if (filter) {
    if (filter.suffix === null) {
      // artist
      visible = products;
    } else {
      visible = products.filter((product) => product.id.endsWith(filter.suffix));
    }
  }

  const clearFilter = () => setSearchParams({});

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow={filter ? filter.label : 'Product'}
        title={filter ? filter.label : 'All Products'}
      />

      {filter && (
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm text-muted">กำลังแสดง:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilter}
            className="pr-2!"
          >
            {filter.label}
            <X className="size-4" />
          </Button>
          <Link to="/products" className="text-sm text-primary hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-5 lg:justify-start">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
        {visible.length === 0 && (
          <p className="text-muted">ยังไม่มีสินค้าในหมวดนี้</p>
        )}
      </div>
    </Container>
  );
}
