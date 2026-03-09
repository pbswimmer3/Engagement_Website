import PhotoGallery from '@/components/PhotoGallery'

// ─── UPDATE THESE WITH YOUR EVENT DETAILS ────────────────────────────────────
const EVENT = {
  date: 'Saturday, May 30th, 2026',       // e.g. "Saturday, 12th April 2025"
  time: '[Time]',                  // e.g. "6:00 PM onwards"
  venue: 'Majestic Banquet Events',           // e.g. "The Grand Ballroom"
  address: '4175 Inland Empire Boulevard, Ontario, CA, USA',       // e.g. "123 High Street, London, SW1A 1AA"
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <p className="font-sans text-6xl uppercase tracking-[0.5em] text-gold mb-16">
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
          <p className="font-serif text-4xl font-light text-dark/75">{EVENT.date}</p>
          <p className="font-serif text-4xl font-light text-dark/75 mt-6">{EVENT.time}</p>
          <p className="font-serif text-3xl font-light text-dark/75 mt-6">{EVENT.venue}</p>
          <p className="font-serif text-4xl font-light text-dark/75 mt-6">{EVENT.address}</p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-rose-light overflow-hidden">
        <h2 className="font-serif text-3xl text-center text-dark/50 italic mb-12">
          A Glimpse of Us
        </h2>
        <PhotoGallery />
      </section>
    </>
  )
}
