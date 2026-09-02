import { Link } from 'react-router-dom';
import { genres } from '../../data/sections';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Placeholder from '../ui/Placeholder';

export default function GenreCircles() {
  return (
    <section className="pb-16">
      <Container>
        <SectionHeading
          eyebrow="Product"
          title="Browse By Genre"
          align="center"
          className="items-center text-center"
        />

        <ul className="mt-12 flex flex-wrap items-start justify-center gap-x-8 gap-y-8">
          {genres.map((g) => (
            <li key={g.id} className="flex w-39 flex-col items-center gap-3">
              <Link
                to={`/products?cat=${g.id}`}
                className="grid size-39 place-items-center overflow-hidden rounded-pill bg-white transition hover:scale-105"
                aria-label={g.label}
              >
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
              <span className="text-center text-xl font-medium">{g.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
