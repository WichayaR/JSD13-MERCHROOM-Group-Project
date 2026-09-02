import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/sections';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Placeholder from '../ui/Placeholder';

export default function CategoriesGrid() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Categories"
          title="A Merch for Every Passion"
          description="Whether it's a design from your favorite artist, band merch, or Thai craftsmanship, we've organized it all so you can find what speaks to you. Every interest deserves its own space."
          align="center"
          className="items-center text-center"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((cat, idx) => {

            const spanMap = ['md:col-span-1', 'md:col-span-2', 'md:col-span-2', 'md:col-span-1'];
            return (
              <Link
                key={cat.id}
                to={`/products?cat=${cat.id}`}
                className={`group relative overflow-hidden rounded-card shadow-card transition hover:brightness-95 ${spanMap[idx]}`}
                style={{
                  backgroundImage: cat.cover ? `url(${cat.cover})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >

                <div className="h-72" />

                {!cat.cover && <Placeholder label={cat.title} className="absolute inset-0" />}

                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/60" />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-pill bg-white/20 px-5 py-2 backdrop-blur-sm">
                  <span className="text-xl font-medium text-white">{cat.title}</span>
                  <ArrowRight className="size-5 text-white" />
                </div>

    
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="max-w-113 text-base leading-relaxed text-white">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
