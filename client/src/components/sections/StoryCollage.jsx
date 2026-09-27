import Button from "../ui/Button";
import Container from "../ui/Container";

// ไฟล์: client/src/components/sections/StoryCollage.jsx
// ส่วนเล่าเรื่องราวและวิสัยทัศน์ของแบรนด์ (Story of Merchroom)
// เรียกมาจาก: Home.jsx (วางต่อจากหมวดหมู่ CategoriesGrid)
// มีปุ่ม CTA พาผู้ใช้ไปยัง: หน้าแนะนำทีมงาน (/about)
export default function StoryCollage() {
  return (
    <section className="pb-20 pt-7">
      <Container>
        {/* เลย์เอาต์แบ่ง 2 ฝั่ง: ซ้ายเป็นหัวข้อหลัก ขวาเป็นข้อความขยายความและปุ่มกด */}
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-4 md:grid-cols-1 md:gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary md:text-xl">
              Story of Merchroom
            </p>
            <h2 className="mt-3 text-xl font-bold leading-tight md:mt-6 md:text-5xl md:leading-normal">
              Where collectibles from everywhere{" "}
              <span className="text-violet">finally share one room</span>.
            </h2>
          </div>

          <div>
            <p className="max-w-152.75 text-sm font-bold leading-5 md:text-2xl md:leading-9">
              Long pre-orders. Drops that sell out in hours. Craftwork
              nobody&apos;s heard of. MERCHROOM brings it all into one room.
            </p>

            {/* แถวล่าง: คำอธิบายสนับสนุนคู่กับปุ่ม Meet the Room */}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-63.25 text-[10px] font-bold leading-4 text-muted sm:text-[15px] sm:leading-5.5">
                STORY OF MAKING SPACE FOR THAI ARTISTS, LOCAL CRAFTS, AND FAN
                COMMUNITIES
              </p>
              {/* ส่ง prop to="/about" เพื่อให้ Button เรนเดอร์เป็น Link ของ react-router โดยอัตโนมัติ */}
              <Button
                to="/about"
                variant="highlight"
                size="lg"
                className="!h-12 w-full shrink-0 px-4 text-sm font-semibold sm:w-78 md:!h-13 md:px-7 md:text-base"
              >
                Meet the Room
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
