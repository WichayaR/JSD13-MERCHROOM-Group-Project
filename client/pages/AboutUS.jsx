import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import SectionHeading from '../src/components/ui/SectionHeading';

export default function About() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl rounded-card bg-white p-8">
        <SectionHeading eyebrow="Story of Merchroom" title="About Us" />

        <p className="mt-6 leading-relaxed text-black/70">
          Merchroom เป็นแพลตฟอร์มศูนย์กลางสินค้าลิขสิทธิ์แท้จากศิลปิน ที่มุ่งสร้างพื้นที่ให้ศิลปินไทย
          งานหัตถกรรมท้องถิ่น และคอมมูนิตี้แฟนคลับได้อยู่ร่วมกันในห้องเดียว
        </p>

        <h2 className="mt-8 text-lg font-semibold">Our Values</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-black/70">
          <li>ลิขสิทธิ์แท้ 100%</li>
          <li>ความเป็นธรรมต่อศิลปินและผู้ซื้อ</li>
          <li>ประสบการณ์ที่เข้าใจวัฒนธรรมแฟนคลับ</li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button to="/" variant="outline">
            Home
          </Button>
          <Button to="/products">Products</Button>
        </div>
      </div>
    </Container>
  );
}
