import Logo from './ui/Logo';

/* โครงลิงก์ footer */
const footerColumns = [
  {
    title: 'CATEGORIES',
    links: [
      'Music A - Z',
      'Character A - Z',
      'Apparel',
      'Accessories',
      'Arrivals - Just Dropped!',
      'Upcoming',
      'Featured',
      'Sale & Promotions',
    ],
  },
  {
    title: 'INFORMATION',
    links: [
      'About Us',
      'Contact Us',
      'Copyright Information',
      'FAQs',
      'Privacy Policy',
      'Shipping & Returns Policy',
      'Size Guides',
      'Terms & Conditions',
      'Sitemap',
    ],
  },
  {
    title: 'Makers',
    links: ['Artist', 'Band', 'Craftsmen', 'Local Studios', 'View All Makers'],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-cream-text">
      <div className="px-6 pb-16 pt-10 lg:px-15">
        {/* แบ่ง footer ออกจาก section คอนเสิร์ต */}
        <div className="h-px bg-white" />

        <div className="mt-9 grid gap-12 md:grid-cols-2 lg:grid-cols-[1fr_repeat(3,auto)] lg:gap-20">
          <div>
            <Logo tone="lime" size="lg" />
            <p className="mt-6 max-w-91.75 text-base leading-relaxed text-white">
              More than merch, it&apos;s a room full of good things waiting to find their way to you
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-base font-bold text-highlight">{column.title}</h2>
              <ul className="mt-3 space-y-0.75">
                {column.links.map((label) => (
                  <li key={label}>
                    <a href="#" className="text-sm transition hover:text-highlight">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="bg-[#d9d9d9]">
        <div className="px-6 py-6 lg:px-15">
          <p className="text-base text-[#6e6e6e]">@merchroom All Right Reserved</p>
        </div>
      </div>
    </footer>
  );
}
