import PhotoGallery from '@/components/PhotoGallery'

// ─── UPDATE THESE WITH YOUR EVENT DETAILS ────────────────────────────────────
const EVENT = {
  date: 'Saturday, May 30th, 2026',       // e.g. "Saturday, 12th April 2025"
  time: '6:00 PM onwards',                  // e.g. "6:00 PM onwards"
  venue: 'Majestic Banquet Events',           // e.g. "The Grand Ballroom"
  address: '4175 Inland Empire Boulevard, Ontario, CA, USA',       // e.g. "123 High Street, London, SW1A 1AA"
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        {/* "The Engagement Celebration Of" — serif, navy, smaller */}
        <p className="font-serif text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.2em] text-navy mb-8 md:mb-12">
          The Engagement Celebration Of
        </p>

        {/* Script name — off-white, increased word spacing */}
        <h1
          className="font-script text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-offwhite leading-none mb-10 [word-spacing:0.35em]"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.22)' }}
        >
          Aanya &amp; Prad
        </h1>

        {/* Decorative divider */}
        <div className="flex items-center gap-5 mb-8 md:mb-10">
          <span className="block w-16 sm:w-24 h-px bg-gold/60" />
          <span className="text-gold text-sm">&#9670;</span>
          <span className="block w-16 sm:w-24 h-px bg-gold/60" />
        </div>

        <div className="space-y-3 md:space-y-2">
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-navy">{EVENT.date}</p>
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-navy mt-4 md:mt-6">{EVENT.time}</p>
          <p className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-navy mt-4 md:mt-6">{EVENT.venue}</p>
          <p className="font-serif text-lg sm:text-xl md:text-2xl font-light text-navy mt-4 md:mt-6">{EVENT.address}</p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 overflow-hidden">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center text-denim italic mb-12">
          A Glimpse of Us
        </h2>
        <PhotoGallery />
      </section>
    </>
  )
}
