import { products } from '../src/data/product';
import { useCart } from '../src/context/CartContext';
import Container from '../src/components/ui/Container';
import ProductCard from '../src/components/ui/ProductCard';
import SectionHeading from '../src/components/ui/SectionHeading';

export default function ThaiHeritage() {
  const { addToCart } = useCart();
  const heritageProducts = products.filter((product) => product.id.endsWith('hr'));

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Categories"
        title="Thai Heritage"
        description="งานหัตถกรรมและงานฝีมือจากช่างไทย ที่นำอัตลักษณ์ทางวัฒนธรรมมาตีความใหม่ให้เข้ากับการใช้งานร่วมสมัย"
      />

      <div className="mt-10 flex flex-wrap justify-center gap-5 lg:justify-start">
        {heritageProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </Container>
  );
}
