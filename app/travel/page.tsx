// ─── UPDATE THESE VALUES ──────────────────────────────────────────────────────
const VENUE = {
  name: '[Venue Name]',
  address: '[Full Address, City, Postcode]',
  parkingInfo: '[Parking details — e.g. "Free parking is available in the venue car park."]',

  // HOW TO GET YOUR GOOGLE MAPS EMBED URL:
  // 1. Go to maps.google.com and search for your venue address
  // 2. Click Share → Embed a map
  // 3. Copy the src="..." value from the <iframe> code shown
  // 4. Paste it below
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3...',
}

const TRAVEL_TIPS = [
  {
    title: 'By Car',
    body: '[Add driving directions here — e.g. "Exit the M25 at Junction 12, follow signs to..."]',
  },
  {
    title: 'By Train',
    body: '[Add train info here — e.g. "The nearest station is X, a 10-minute taxi from the venue."]',
  },
  {
    title: 'Nearby Hotels',
    body: '[Add hotel suggestions here — e.g. "Premier Inn X (0.3 miles), Holiday Inn Y (0.5 miles)"]',
  },
]
// ─────────────────────────────────────────────────────────────────────────────

export default function TravelPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-dark mb-3">Getting Here</h1>
          <div className="flex items-center justify-center gap-4">
            <span className="block w-16 h-px bg-gold/60" />
            <span className="text-gold text-sm">&#9670;</span>
            <span className="block w-16 h-px bg-gold/60" />
          </div>
        </div>

        {/* Venue card */}
        <div className="bg-white border border-gold/25 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="font-serif text-2xl text-dark mb-1">{VENUE.name}</h2>
          <p className="font-sans text-sm text-dark/55 mb-5">{VENUE.address}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(VENUE.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 border border-rose text-rose font-sans text-xs uppercase tracking-wider rounded-lg hover:bg-rose hover:text-cream transition-colors"
          >
            Open in Google Maps &rarr;
          </a>
        </div>

        {/* Map embed */}
        <div className="rounded-2xl overflow-hidden border border-gold/20 shadow-sm mb-10">
          <iframe
            src={VENUE.googleMapsEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue location map"
          />
        </div>

        {/* Travel tips grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {TRAVEL_TIPS.map((tip) => (
            <div key={tip.title} className="bg-rose-light/60 rounded-2xl p-6">
              <h3 className="font-serif text-lg text-dark mb-2">{tip.title}</h3>
              <p className="font-sans text-sm text-dark/55 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>

        {/* Parking */}
        <div className="mt-4 bg-gold/10 border border-gold/20 rounded-2xl p-6">
          <h3 className="font-serif text-lg text-dark mb-2">Parking</h3>
          <p className="font-sans text-sm text-dark/55 leading-relaxed">{VENUE.parkingInfo}</p>
        </div>
      </div>
    </div>
  )
}
