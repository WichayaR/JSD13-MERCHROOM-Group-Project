import { Link } from "react-router-dom";
import { genres } from "../../data/sections";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Placeholder from "../ui/Placeholder";

// ไฟล์: client/src/components/sections/GenreCircles.jsx
// ส่วนแสดงรายการแนวเพลง/สไตล์สินค้าแบบวงกลม (Browse By Genre)
// เรียกมาจาก: Home.jsx (คลิกแล้วส่ง genre id ไปที่หน้า /products)
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

        {/* มือถือใช้แถบเลื่อนแนวนอนเพื่อคงขนาดไอคอนให้ใหญ่โดยไม่ตัดเป็นหลายแถว */}
        <ul className="mt-8 flex snap-x snap-mandatory gap-20 overflow-x-auto px-2 pb-3 justify-center sm:mt-12 sm:flex sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-8 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pb-0">
          {genres.map((g) => (
            <li
              key={g.id}
              className="flex w-24 shrink-0 snap-center flex-col items-center gap-2 sm:w-39 sm:gap-3"
            >
              <Link
                to={`/products?genre=${encodeURIComponent(g.id)}`}
                className="grid size-32 mx-3 place-items-center overflow-hidden rounded-pill bg-white transition hover:scale-105 sm:size-39 sm:mx-"
                aria-label={g.label}
              >
                {/* ถ้ามีรูปให้โหลดแบบ lazy-loading ถ้าไม่มีให้แสดง placeholder เพื่อไม่ให้หน้าพัง */}
                {g.image ? (
                  <img
                    src={g.image}
                    alt={g.label}
                    loading="lazy"
                    className={
                      g.id === "apparel"
                        ? "h-full w-full translate-y-3 scale-[2.4] object-contain"
                        : "h-[80%] w-[80%] object-contain"
                    }
                  />
                ) : (
                  <Placeholder label={g.label} className="h-full w-full" />
                )}
              </Link>
              {/* ป้ายชื่อแนวเพลงใต้รูป */}
              <span className="text-center text-sm font-medium sm:text-xl">
                {g.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
