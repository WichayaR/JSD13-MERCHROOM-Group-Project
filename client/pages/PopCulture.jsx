import { products } from '../src/data/product';
import { useCart } from '../src/context/CartContext';
import Container from '../src/components/ui/Container';
import ProductCard from '../src/components/ui/ProductCard';
import SectionHeading from '../src/components/ui/SectionHeading';

export default function PopCulture() {
  const { addToCart } = useCart();
  const popProducts = products.filter((product) => product.id.endsWith('en'));

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Categories"
        title="Pop Culture"
        description="สินค้าลิขสิทธิ์แท้จากศิลปินและวงดนตรีระดับสากล ตั้งแต่เสื้อผ้าทัวร์คอนเสิร์ตจนถึงแผ่นเสียงสะสม"
      />

      <div className="mt-10 flex flex-wrap justify-center gap-5 lg:justify-start">
        {popProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </Container>
  );
}
