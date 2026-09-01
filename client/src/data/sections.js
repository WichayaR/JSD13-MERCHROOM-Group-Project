/* ข้อมูลสำหรับ section ต่างๆ ของ landing page
 * รวมไว้ที่เดียวเพื่อให้แก้ที่เดียว ไม่ต้องไล่แก้หลายไฟล์
 * เรื่องรูปภาพ: ใช้ img() helper แบบเดียวกับ product.js — ถ้าไฟล์ไม่มี img()
 * จะคืน '' และ component ปลายทางจะ fallback ไปแสดง Placeholder แทน */
import { products } from './product';
export { products };

const images = import.meta.glob('../../assets/{Thai,Eng,Heritage}/*.{png,PNG,PNG,PNG}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function img(fileName) {
  const match = Object.keys(images).find((path) => path.endsWith(`/${fileName}`));
  return match ? images[match] : '';
}

/* หาสินค้าจาก id; คืน null ถ้าไม่เจอ ให้ปลายทางใช้ Placeholder แทน */
function prod(id) {
  return products.find((p) => p.id === id) || null;
}

// Hero product hotspots 
export const heroHotspots = [
  { id: 'h1', productId: '07hr', size: 'sm', x: 'left-[calc(50%_+_274px)]', y: 'top-[136px]' },
  { id: 'h2', productId: '05hr', size: 'md', x: 'left-[calc(50%_-_479px)]', y: 'top-[330px]' },
  { id: 'h3', productId: '02hr', size: 'lg', x: 'left-[calc(50%_+_451px)]', y: 'top-[185px]' },
];

// Best Sellers แถวแนวกับ "Find your merch Find your match"
export const bestSellerIds = ['05hr', '02hr', '01hr', '04hr', '06hr', '07hr'];

// Categories 4 การ์ด 
export const categories = [
  {
    id: 'thai-band',
    title: 'Thai Band',
    cover: img('6.JACKET_20th_SpicyDisc.png'),
    description: 'Authentic licensed merchandise from the artist to support the artist.',
  },
  {
    id: 'pop-culture',
    title: 'Movie',
    cover: img('16.Billie-Eilish_World Tour Pullover Hoodie.PNG'),
    description: 'Merch จากหนัง ซีรีส์ และคอนเทนต์ระดับโลก',
  },
  {
    id: 'thai-heritage',
    title: 'Thai Heritage',
    cover: img('2.กระเป๋าสานผักตบ_รุ่นฟลอร่า_M_คละสี.png'),
    description: 'งานหัตถกรรมไทยจากช่างฝีมือทั่วประเทศ',
  },
  {
    id: 'artist',
    title: 'Artist',
    cover: img('1.CD_Parkinson.png'),
    description: 'ผลงานโดยตรงจากศิลปินอิสระ',
  },
];

// Browse By Genre - 7 วงกลม 
export const genres = [
  { id: 'apparel',      label: 'Apparel',         image: img('15.Uncle-Ben_Classic-T.png') },
  { id: 'bags',         label: 'Bags',            image: img('21.A7X_Europe Tour Libad-Tote.png') },
  { id: 'collectibles', label: 'Collectibles',    image: img('11.Linkin-Park_Soundtrack Citrus Vinyl 2lp.png') },
  { id: 'home',         label: 'Home & Lifestyle', image: img('10.Justin-Bieber_Peaches Nalgene.png') },
  { id: 'accessories',  label: 'Accessories',     image: img('16.Uncle-Ben_Keychain.png') },
  { id: 'posters',      label: 'Posters',         image: img('12.Whal&Dolph_Poster.png') },
  { id: 'handicraft',   label: 'Handicraft',      image: img('1.พวงกุญแจลิเภา.png') },
];

// What's Landing - โปสเตอร์ carousel
// 5 รายการสำหรับแสดงบนพื้นเข้ม
export const landingItems = [
  { id: 'l1', title: 'Maroon 5 มาแสดงคอนเสิร์ตที่ไทย 9 กุมภาพันธ์ 2027', image: img('11.Nont-Tanont_Vinyl.png') },
  { id: 'l2', title: 'Limited Drop — T-Pop Live Tour', image: img('12.Whal&Dolph_Poster.png') },
  { id: 'l3', title: 'Featured — Uncle Ben Album', image: img('18.Uncle-Ben_Album.png') },
  { id: 'l4', title: 'New Arrival — Whal&Dolph', image: img('14.Whal&Dolph_long-T-shirt.png') },
  { id: 'l5', title: 'Coming Soon — SpicyDisc 20th', image: img('6.JACKET_20th_SpicyDisc.png') },
];

// Road to Thai Artist - collage ใหญ่
// 3 polaroid ฝั่ง Pop (พื้นขาว) + กรอบไวนิลดำ + 3 polaroid ฝั่ง Thai (พื้นเข้ม)
// + 6 รูปหัตถกรรมบนการ์ด Thai Handcraft Edit
// productId อ้าง data/product.js — ตัวที่ไม่มีสินค้าจริง (PUN/PROXIE/MILLI)
// ใช้สินค้าไทยใน assets แทนชั่วคราว ถ้าไม่เจอ component จะ fallback เป็น Placeholder
export const roadToThaiArtist = {
  vinylProductId: '22en', 
  pop: [
    { id: 'p1', productId: '01en', rotate: -4.57 },      // Taylor Swift cropped tee
    { id: 'p2', productId: '08en', rotate: 3.55 },       // Justin Bieber tie dye
    {
      id: 'p3',
      productId: '09en',
      overlayProductId: '16en', // ซ้อน 2 รูป (Justin + Billie) บนการ์ดเดียว
      rotate: -1.84,
    },
  ],
  thai: [
    { id: 'p4', productId: '05th', rotate: 4.1, wide: true }, // PUN
    { id: 'p5', productId: '04th', rotate: -4.25 }, // MILLI
    { id: 'p6', productId: '01th', rotate: -4.11 }, // PROXIE
  ],
  handcraft: [
    img('1.พวงกุญแจลิเภา.png'),
    img('2.กระเป๋าสานผักตบ_รุ่นฟลอร่า_M_คละสี.png'),
    img('3.กระเป๋า chaksarn รุ่นMini Candy สีธรรมชาติ-ดำ.png'),
    img('4.ผ้าพันคอ ตะกอสีเหลือง.png'),
    img('5.ชุดแก้วช้างลายคราม.png'),
    img('6.Pride Clutch ป่านศรนารายณ์.png'),
  ],
};

// Filter mapping (ใช้กับ Product.jsx)
// map cat query string → id suffix pattern
export const categoryFilter = {
  'thai-band':     { suffix: 'th', label: 'Thai Band' },
  'pop-culture':   { suffix: 'en', label: 'Pop Culture' },
  'movie':         { suffix: 'en', label: 'Movie' },
  'thai-heritage': { suffix: 'hr', label: 'Thai Heritage' },
  'artist':        { suffix: null, label: 'Artist' }, // ทั้งหมด (placeholder)
};

export { prod, img };
