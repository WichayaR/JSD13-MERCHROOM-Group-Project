import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../src/data/product';
import { bestSellerIds, heroHotspots, prod as findProduct } from '../src/data/sections';
import { useCart } from '../src/context/CartContext';
import Button from '../src/components/ui/Button';
import Container from '../src/components/ui/Container';
import ProductCard from '../src/components/ui/ProductCard';
import Hotspot from '../src/components/ui/Hotspot';
import CategoriesGrid from '../src/components/sections/CategoriesGrid';
import StoryCollage from '../src/components/sections/StoryCollage';
import GenreCircles from '../src/components/sections/GenreCircles';
import LandingCarousel from '../src/components/sections/LandingCarousel';
import RoadToThaiArtist from '../src/components/sections/RoadToThaiArtist';
import heroBanner from '../assets/Banner/hero-banner.png';

const tabs = [
  { id: 'best', label: 'Best Sellers' },
  { id: 'new', label: 'New Arrival' },
];

export default function Home() {
  const { addToCart } = useCart();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('best');

  /* Mock: Best Sellers, New Arrival ของจริงจะมาจาก API ตอนต่อ server */
  const visibleProducts =
    activeTab === 'best'
      ? bestSellerIds.map((id) => findProduct(id)).filter(Boolean)
      : products.filter((product) => product.id.endsWith('en'));

  const scrollByCard = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 379, behavior: 'smooth' });
  };

  return (
    <>
      {/* HERO + hotspots */}
      <section className="relative bg-brand-gradient">
        <div
          className="relative flex h-202.5 items-end justify-center pb-52"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: '1441px 810px',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <h1 className="sr-only">MERCHROOM — Rooted in Culture</h1>

          {/* product hotspots */}
          {heroHotspots.map((spot) => (
            <div key={spot.id} className={`absolute ${spot.x} ${spot.y}`}>
              <Hotspot product={findProduct(spot.productId)} size={spot.size} />
            </div>
          ))}

          <Button
            to="/products"
            variant="highlight"
            size="lg"
            className="w-100 font-semibold lg:translate-x-19.5"
          >
            Support Thai Artist
          </Button>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="relative -mt-9.5 rounded-t-section bg-cream py-20">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h2 className="font-display text-[32px] leading-tight md:text-5xl">
              Find your merch Find your match
            </h2>

            <div className="flex items-center gap-8" role="tablist" aria-label="หมวดสินค้าแนะนำ">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={`text-xl transition ${isActive ? 'font-semibold text-violet' : 'text-ink'}`}
                    >
                      {tab.label}
                    </span>
                    <span
                      className={`h-1.25 w-32.5 rounded-card transition ${isActive ? 'bg-violet' : 'bg-transparent'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* desktop card */}
          <div
            ref={scrollRef}
            className="scrollbar-hide mt-10 flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory"
            role="tabpanel"
          >
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="flex w-[85%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
              >
                <ProductCard product={product} onAddToCart={addToCart} fluid />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="h-1.25 w-81 max-w-full rounded-card bg-muted">
              <div className="h-full w-37.25 rounded-card bg-ink" />
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="เลื่อนไปทางซ้าย"
                className="grid size-9 place-items-center rounded-pill bg-ink text-white transition hover:opacity-80"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="เลื่อนไปทางขวา"
                className="grid size-9 place-items-center rounded-pill bg-ink text-white transition hover:opacity-80"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <CategoriesGrid />

      {/* STORY OF MERCHROOM */}
      <StoryCollage />

      {/* ROAD TO THAI ARTIST — polaroid collage ใหญ่ */}
      <RoadToThaiArtist />

      {/* BROWSE BY GENRE */}
      <GenreCircles />

      {/* WHAT'S LANDING */}
      <LandingCarousel />
    </>
  );
}
