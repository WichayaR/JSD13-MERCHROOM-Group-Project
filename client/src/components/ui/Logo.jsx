// ไฟล์: client/src/components/ui/Logo.jsx
// คอมโพเนนต์โลโก้แบรนด์ Merchroom (ไอคอนเห็ด + ตัวหนังสือ)
// เรียกมาจาก: Navbar.jsx (ขนาด md) และ Footer.jsx (ขนาด lg โทน lime)
// แหล่งไฟล์ภาพ SVG: โฟลเดอร์ assets/Merchroom-Logo/
import { Link } from 'react-router-dom';
import iconMushroom from '../../../assets/Merchroom-Logo/icon-mushroom.svg';
import wordmarkWhite from '../../../assets/Merchroom-Logo/wordmark-white.svg';
import wordmarkLime from '../../../assets/Merchroom-Logo/wordmark-lime.svg';

// อัตราส่วนความกว้างต่อความสูงของไอคอนเห็ดและตัวหนังสือ เพื่อคำนวณ height ไม่ให้รูปเบี้ยว
const iconRatio = 1368.75 / 1500;
const wordmarkRatio = {
  light: 261.75 / 1500,
  lime: 231.644531 / 1500,
};

// ขนาดของโลโก้: md สำหรับแถบ Navbar, lg สำหรับส่วน Footer
const sizes = {
  md: { icon: 29, wordmark: 122 },
  lg: { icon: 48, wordmark: 275 },
};

// คอมโพเนนต์โลโก้หลักของ Merchroom (กดแล้วลิงก์กลับหน้าแรก)
export default function Logo({ tone = 'light', size = 'md', className = '' }) {
  const s = sizes[size] || sizes.md;
  const isLime = tone === 'lime';
  // สลับไฟล์รูปตัวหนังสือตามธีมสี: สีเขียว lime (Footer) หรือ สีขาว (Navbar)
  const wordmarkSrc = isLime ? wordmarkLime : wordmarkWhite;

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 transition hover:opacity-90 ${className}`}
      aria-label="MERCHROOM หน้าหลัก"
    >
      {/* ไอคอนเห็ด Merchroom */}
      <img
        src={iconMushroom}
        alt=""
        width={s.icon}
        height={Math.round(s.icon * iconRatio)}
        aria-hidden="true"
      />
      {/* ข้อความชื่อแบรนด์ MERCHROOM */}
      <img
        src={wordmarkSrc}
        alt="MERCHROOM"
        width={s.wordmark}
        height={Math.round(s.wordmark * (isLime ? wordmarkRatio.lime : wordmarkRatio.light))}
      />
    </Link>
  );
}
