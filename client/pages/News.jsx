import Container from '../src/components/ui/Container';
import SectionHeading from '../src/components/ui/SectionHeading';

export default function News() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="The Room Talks"
        title="What's Landing, What's Live"
        description="ข่าวคอนเสิร์ต ทัวร์ และการเปิดจำหน่ายสินค้ารอบใหม่"
      />

      <p className="mt-10 text-black/60">กำลังจัดทำเนื้อหาส่วนนี้</p>
    </Container>
  );
}
