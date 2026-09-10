import { Link } from 'react-router-dom';
import { genres } from '../../data/sections';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Placeholder from '../ui/Placeholder';

// ไฟล์: client/src/components/sections/GenreCircles.jsx
// ส่วนแสดงรายการแนวเพลง/สไตล์สินค้าแบบวงกลม (Browse By Genre)
// เรียกมาจาก: Home.jsx (คลิกแล้วส่ง query string ?cat=id ไปที่หน้า /products)
// แหล่งข้อมูล: อาเรย์ genres จาก src/data/sections.js
export default function GenreCircles() {
  return (
    <section className="pb-16">
      <Container>
        {/* หัวข้อส่วน Browse By Genre */}
        <SectionHeading
          eyebrow="Product"
          title="Browse By Genre"
          align="center"
          className="items-center text-center"
        />

        {/* รายการวงกลมแนวเพลง จัดเรียงแบบ flex-wrap และจัดกึ่งกลาง */}
        <ul className="mt-12 flex flex-wrap items-start justify-center gap-x-8 gap-y-8">
          {genres.map((g) => (
            <li key={g.id} className="flex w-39 flex-col items-center gap-3">
              {/* ลิงก์กดแล้วส่ง query param ?cat=id ไปที่หน้า /products */}
              <Link
                to={`/products?cat=${g.id}`}
                className="grid size-39 place-items-center overflow-hidden rounded-pill bg-white transition hover:scale-105"
                aria-label={g.label}
              >
                {/* ถ้ามีรูปให้โหลดแบบ lazy-loading ถ้าไม่มีให้แสดง placeholder เพื่อไม่ให้หน้าพัง */}
                {g.image ? (
                  <img
                    src={g.image}
                    alt={g.label}
                    loading="lazy"
                    className="h-[80%] w-[80%] object-contain"
                  />
                ) : (
                  <Placeholder label={g.label} className="h-full w-full" />
                )}
              </Link>
              {/* ป้ายชื่อแนวเพลงใต้รูป */}
              <span className="text-center text-xl font-medium">{g.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
