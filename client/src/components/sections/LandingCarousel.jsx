import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { landingItems } from '../../data/sections';
import Container from '../ui/Container';
import Button from '../ui/Button';
import SectionHeading from '../ui/SectionHeading';
import Placeholder from '../ui/Placeholder';

// ไฟล์: client/src/components/sections/LandingCarousel.jsx
// ส่วนแสดงสไลเดอร์โปสเตอร์อีเวนต์และไฮไลต์สินค้า (Landing Carousel แสดง 5 ใบพร้อมกัน)
// เรียกมาจาก: Home.jsx (วางต่อจากแถบเลื่อน Best Sellers / New Arrival)
// แหล่งข้อมูล: อาเรย์ landingItems จาก src/data/sections.js
export default function LandingCarousel() {
  const [index, setIndex] = useState(0);
  const total = landingItems.length;

  // ฟังก์ชันเลื่อนการ์ดแบบ Circular Loop (วนลูปกลับมาตัวแรก/สุดท้ายได้ไม่รู้จบ)
  const go = (delta) => setIndex((i) => (i + delta + total) % total);

  // ดึง item ตาม offset เทียบกับ index ปัจจุบัน เช่น -2, -1, 0, 1, 2
  const itemAt = (offset) => landingItems[(index + offset + total) % total];
  const current = itemAt(0);

  return (
    <section className="rounded-t-section bg-ink pb-16 pt-10">
      <Container>
        {/* หัวข้อส่วน The Room Talks */}
        <SectionHeading
          eyebrow="The Room Talks"
          title="What's Landing, What's Live"
          align="center"
          onDark
          className="items-center text-center"
        />
      </Container>

      {/* แถวแสดงการ์ดโปสเตอร์ 5 ใบเรียงกัน: ซ้ายสุด ซ้าย กลาง(เด่นสุด) ขวา ขวาสุด */}
      <div className="mt-12 flex w-full items-center justify-center gap-3">
        <PosterCard item={itemAt(-2)} size="sm" />
        <PosterCard item={itemAt(-1)} size="sm" onClick={() => go(-1)} ariaLabel="ก่อนหน้า" />
        <PosterCard item={current} size="lg" />
        <PosterCard item={itemAt(1)} size="sm" onClick={() => go(1)} ariaLabel="ถัดไป" />
        <PosterCard item={itemAt(2)} size="sm" />
      </div>

      <Container>
        <div className="mt-16 flex items-center justify-between gap-6">
          {/* แถบ Progress Bar แสดงความคืบหน้าของสไลด์ */}
          <div className="h-1.25 w-81 max-w-full overflow-hidden rounded-card bg-muted">
            <div
              className="h-full rounded-card bg-highlight transition-all"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>

          {/* ปุ่มกดเลื่อนซ้าย-ขวา */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="ก่อนหน้า"
              className="grid size-9 place-items-center rounded-pill border border-white text-white transition hover:bg-white hover:text-ink cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="ถัดไป"
              className="grid size-9 place-items-center rounded-pill border border-white text-white transition hover:bg-white hover:text-ink cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* ปุ่ม Explore More พาไปดูคอลเลกชันเพิ่มเติม */}
        <div className="mt-16 flex justify-center">
          <Button variant="highlight" size="lg" className="w-100 font-semibold">
            Explore More
          </Button>
        </div>
      </Container>
    </section>
  );
}

// การ์ดแสดงโปสเตอร์ภาพ รองรับทั้งขนาดใหญ่ (lg สำหรับรูปตรงกลาง) และขนาดเล็ก (sm สำหรับรูปขนาบข้าง)
function PosterCard({ item, size, onClick, ariaLabel }) {
  const isLg = size === 'lg';
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
      className={`shrink overflow-hidden rounded-card shadow-card ${isLg ? 'basis-[28%]' : 'basis-[20%]'} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{ aspectRatio: isLg ? '470 / 612' : '394 / 513' }}
    >
      {item.image ? (
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      ) : (
        <Placeholder label={item.title} className="h-full" />
      )}
    </div>
  );
}
