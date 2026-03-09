// ─── UPDATE THESE VALUES ──────────────────────────────────────────────────────
const VENUE = {
  name: 'Majestic Banquet Events',
  address: '4175 Inland Empire Boulevard, Ontario, CA, USA',
  airportInfo: 'The venue is very close to Ontario International Airport (7-minute drive), so for our out of town guests, we recommend flying into ONT. There are a lot of other options as well though, namely Orange County John Wayne Airport (SNA - 45mi), Long Beach Airport (LGB - 53 mi), Burbank Airport (BUR - 53 mi), and Los Angeles International Airport (LAX - 58mi. This is the farthest from the venue, but will be easiest for our international guests.).',

  // HOW TO GET YOUR GOOGLE MAPS EMBED URL:
  // 1. Go to maps.google.com and search for your venue address
  // 2. Click Share → Embed a map
  // 3. Copy the src="..." value from the <iframe> code shown
  // 4. Paste it below
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6609.781279245813!2d-117.56362442301271!3d34.072317573149455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c335021953e55b%3A0x6e95cea2da345ea7!2sMajestic%20Banquet%20%26%20Events!5e0!3m2!1sen!2sus!4v1773018542339!5m2!1sen!2sus',
}

const TRAVEL_TIPS = [
  {
    title: 'Nearby Hotels',
    body: 'There are plenty of hotels within a mile of the venue. Some of these include: Ayres Suites Ontario Mills Mall - Rancho Cucamonga (0.4mi), Homewood Suites by Hilton Ontario-Rancho Cucamonga (0.8mi), Courtyard by Marriot  Ontario Rancho Cucamonga (0.9mi), and about a dozen others.',
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
        <div className="grid sm:grid-cols-1"> {/*Changed from -cols-3 gap-4 to try to make 1 column*/}
          {TRAVEL_TIPS.map((tip) => (
            <div key={tip.title} className="bg-rose-light/60 rounded-2xl p-6">
              <h3 className="font-serif text-lg text-dark mb-2">{tip.title}</h3>
              <p className="font-sans text-sm text-dark/55 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>

        {/* Airport */}
        <div className="mt-4 bg-gold/10 border border-gold/20 rounded-2xl p-6">
          <h3 className="font-serif text-lg text-dark mb-2">Parking</h3>
          <p className="font-sans text-sm text-dark/55 leading-relaxed">{VENUE.airportInfo}</p>
        </div>
      </div>
    </div>
  )
}
