import Button from '../ui/Button';
import Container from '../ui/Container';

export default function StoryCollage() {
  return (
    <section className="pb-20 pt-7">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xl font-bold uppercase tracking-wide text-primary">
              Story of Merchroom
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-normal md:text-5xl">
              Where collectibles from everywhere{' '}
              <span className="text-violet">finally share one room</span>.
            </h2>
          </div>

          <div>
            <p className="max-w-152.75 text-2xl font-bold leading-9">
              Long pre-orders. Drops that sell out in hours. Craftwork nobody&apos;s heard of.
              MERCHROOM brings it all into one room.
            </p>

            <div className="mt-2 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-63.25 text-[15px] font-bold leading-5.5 text-muted">
                STORY OF MAKING SPACE FOR THAI ARTISTS, LOCAL CRAFTS, AND FAN COMMUNITIES
              </p>
              <Button
                to="/about"
                variant="highlight"
                size="lg"
                className="w-78 shrink-0 font-semibold"
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
