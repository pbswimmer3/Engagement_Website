import PhotoGallery from '@/components/PhotoGallery'

// ─── UPDATE THESE WITH YOUR EVENT DETAILS ────────────────────────────────────
const EVENT = {
  date: 'Saturday, [Date]',       // e.g. "Saturday, 12th April 2025"
  time: '[Time]',                  // e.g. "6:00 PM onwards"
  venue: '[Venue Name]',           // e.g. "The Grand Ballroom"
  address: '[Full Address]',       // e.g. "123 High Street, London, SW1A 1AA"
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <p className="font-sans text-xs uppercase tracking-[0.5em] text-gold mb-8">
          Engagement Celebration
        </p>

        <h1 className="font-script text-8xl md:text-9xl text-rose leading-none mb-10">
          Prad &amp; Aanya
        </h1>

        {/* Decorative divider */}
        <div className="flex items-center gap-5 mb-10">
          <span className="block w-24 h-px bg-gold/60" />
          <span className="text-gold text-sm">&#9670;</span>
          <span className="block w-24 h-px bg-gold/60" />
        </div>

        <div className="space-y-2">
          <p className="font-serif text-2xl font-light text-dark/75">{EVENT.date}</p>
          <p className="font-serif text-xl text-dark/60">{EVENT.time}</p>
          <p className="font-serif text-lg text-dark/50 mt-6">{EVENT.venue}</p>
          <p className="font-serif text-base text-dark/40">{EVENT.address}</p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-dark/30">
          <span className="font-sans text-xs uppercase tracking-widest">Our Story</span>
          <span className="block w-px h-8 bg-gold/40" />
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-rose-light overflow-hidden">
        <h2 className="font-serif text-3xl text-center text-dark/50 italic mb-12">
          A Glimpse of Our Story
        </h2>
        <PhotoGallery />
      </section>
    </>
  )
}
