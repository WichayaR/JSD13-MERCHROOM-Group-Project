// ไฟล์: client/pages/ThaiHeritage.jsx
// หน้าคอลเลกชันสินค้ามรดกและหัตถกรรมไทย (Thai Heritage)
// เรียกมาจาก: App.jsx ผ่าน Route path="/thai-heritage" หรือคลิกเมนูบน Navbar
// แหล่งข้อมูลสินค้า: src/data/product.js (กรองสินค้าที่รหัสลงท้ายด้วย hr)
import {
  Droplets,
  Flower2,
  Scissors,
  Shapes,
  Sparkles,
} from 'lucide-react';
import { products } from '../src/data/product';
import Container from '../src/components/ui/Container';
import ProductCard from '../src/components/ui/ProductCard';
import Button from '../src/components/ui/Button';
import { useCart } from '../src/context/CartContext';

// รายการเทคนิคงานหัตถกรรมไทย 5 รูปแบบ
const TECHNIQUES = [
  { id: '01', icon: Sparkles, label: 'ลายผ้าย้อม' },
  { id: '02', icon: Droplets, label: 'เครื่องเขิน' },
  { id: '03', icon: Flower2, label: 'งานปัก' },
  { id: '04', icon: Shapes, label: 'เครื่องปั้นดิน' },
  { id: '05', icon: Scissors, label: 'งานสาน' },
];

// ตัวเลขสถิติผลตอบรับและการสนับสนุนชุมชน
const STATS = [
  { value: '18', label: 'ชุมชน' },
  { value: '12', label: 'ศิลปิน' },
  { value: '200+', label: 'ชิ้นงาน' },
];

// หน้า Thai Heritage: นำเสนอผลงานหัตถกรรม ช่างชุมชน และสินค้ามรดกทางวัฒนธรรม
export default function ThaiHeritage() {
  const { addToCart } = useCart();
  // กรองสินค้าเฉพาะหมวด Thai Heritage ตาม suffix รหัสสินค้า 'hr'
  const heritageProducts = products.filter((product) => product.id.endsWith('hr'));

  return (
    <Container className="py-8">
      {/* 1. Hero Banner ประจำหน้า Thai Heritage */}
      <section className="rounded-section bg-[#b56a4c] px-8 py-14 text-cream-text md:px-14">
        <p className="text-xs font-bold uppercase tracking-widest text-white/90">Thai Heritage</p>
        <h1 className="mt-3 font-display text-3xl leading-tight md:text-5xl">Explore Thai Creativity</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-white/85">
          งานหัตถกรรมและงานฝีมือจากช่างไทย ที่นำอัตลักษณ์ทางวัฒนธรรมมาตีความใหม่ให้เข้ากับการใช้งานร่วมสมัย
        </p>
        <Button to="/products?cat=thai-heritage" variant="highlight" size="lg" className="mt-8">
          ช้อปของสะสมไทย
        </Button>
      </section>

      {/* 2. ส่วนเรื่องเล่างานคราฟต์ (Craft Story) */}
      <section className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div className="h-60 rounded-section bg-ink/5" aria-hidden="true" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Craft Story</p>
          <h2 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">
            จากภาพพระในวัดเก่า สู่งานปริ๊นต์เสื้อยืด
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-black/70">
            จากภาพพระและลวดลายในวัดเก่า เรานำแรงบันดาลใจของช่างพื้นถิ่นมาต่อยอดเป็นงานปริ๊นต์ร่วมสมัย
            ที่ยังคงกลิ่นอายวัฒนธรรมไว้ในทุกชิ้น
          </p>
          <Button to="/products?cat=thai-heritage" variant="outline" size="md" className="mt-6">
            ชมงานทั้งหมด
          </Button>
        </div>
      </section>

      {/* 3. แนะนำชุมชนช่างฝีมือเด่น (Featured Community) */}
      <section className="mt-20">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Featured Community</p>
        <h2 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">งานของชุมชนที่เราคัดส่ง</h2>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
          <div className="flex items-center gap-4">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="size-36 shrink-0 rounded-pill bg-ink/5 md:size-44" aria-hidden="true" />
            ))}
          </div>

          <div className="rounded-section bg-ink/5 p-8 md:p-10">
            <h3 className="text-xl font-bold leading-snug">
              กลุ่มกะเหรี่ยงบ้านวาเย จ.กาญจนบุรี + ปราจีนบุรี
            </h3>
            <p className="mt-3 leading-relaxed text-black/70">
              &ldquo;งานจักสานและผ้าทอของบ้านวาเยสะท้อนวิถีคนรักป่า ต่อยอดสู่เสื้อยืดในแบบฉบับของคนรุ่นใหม่&rdquo;
            </p>
            <Button to="/products?cat=thai-heritage" variant="highlight" size="md" className="mt-6">
              ดูงานชุมชน
            </Button>
          </div>
        </div>
      </section>

      {/* 4. เทคนิคงานคราฟต์ 5 สไตล์ (Browse by Technique) */}
      <section className="mt-20">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Browse by Technique</p>
        <h2 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">ตระเวนเทคนิค</h2>

        <div className="mt-10 grid grid-cols-2 justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {TECHNIQUES.map((technique) => (
            <div key={technique.id} className="flex flex-col items-center gap-3">
              <div className="grid size-36 place-items-center rounded-pill border-2 border-dashed border-ink/25 text-muted">
                <technique.icon className="size-8" aria-hidden="true" />
              </div>
              <span className="font-[Sarabun] text-sm text-muted">{technique.id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ไฮไลต์สินค้าหัตถกรรมเด่น (Handcraft Collection) */}
      <section className="mt-20">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Handcraft Collection</p>
        <h2 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">งานประณีตจากช่างชนเผ่า</h2>

        <div className="mt-8">
          {heritageProducts[0] ? (
            <ProductCard product={heritageProducts[0]} onAddToCart={addToCart} />
          ) : (
            <p className="text-muted">ยังไม่มีสินค้าในหมวดนี้</p>
          )}
        </div>
      </section>

      {/* 6. ตัวเลขสถิติสนับสนุนชุมชน (Community Impact Stats) */}
      <section className="mt-20 rounded-section bg-ink px-8 py-10 text-cream-text md:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-highlight">Community Impact</p>
            <h2 className="mt-3 max-w-xl text-2xl font-bold leading-snug md:text-3xl">
              ทุกที่นี่มี คนส่งมอบงานในแบบของตัวเอง
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-text/80">
              Merchroom มาจากหลายพื้นที่ รวมช่างพื้นเมือง 12 กลุ่มเข้าด้วยกัน เพื่อต่อยอดงานประณีตพื้นถิ่นสู่ตลาด
            </p>
          </div>

          <dl className="flex gap-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-3xl font-bold text-highlight md:text-4xl">{stat.value}</span>
                  <span className="mt-1 block text-sm text-cream-text/80">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </Container>
  );
}
