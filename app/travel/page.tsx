import { Building2, Plane } from 'lucide-react'

// ─── UPDATE THESE VALUES ──────────────────────────────────────────────────────
const VENUE = {
  name: 'Majestic Banquet Events',
  address: '4175 Inland Empire Boulevard, Ontario, CA, USA',

  // HOW TO GET YOUR GOOGLE MAPS EMBED URL:
  // 1. Go to maps.google.com and search for your venue address
  // 2. Click Share → Embed a map
  // 3. Copy the src="..." value from the <iframe> code shown
  // 4. Paste it below
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6609.781279245813!2d-117.56362442301271!3d34.072317573149455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c335021953e55b%3A0x6e95cea2da345ea7!2sMajestic%20Banquet%20%26%20Events!5e0!3m2!1sen!2sus!4v1773018542339!5m2!1sen!2sus',
}

const HOTELS = [
  { name: 'Ayres Suites Ontario Mills Mall', distance: '0.4 mi',
    mapsUrl: 'https://maps.google.com/?q=Ayres+Suites+Ontario+Mills+Mall+Rancho+Cucamonga' },
  { name: 'Homewood Suites by Hilton Ontario-Rancho Cucamonga', distance: '0.8 mi',
    mapsUrl: 'https://maps.google.com/?q=Homewood+Suites+by+Hilton+Ontario+Rancho+Cucamonga' },
  { name: 'Courtyard by Marriott Ontario Rancho Cucamonga', distance: '0.9 mi',
    mapsUrl: 'https://maps.google.com/?q=Courtyard+Marriott+Ontario+Rancho+Cucamonga' },
]

const AIRPORTS = [
  { name: 'Ontario International Airport', code: 'ONT', distance: '7 min drive',
    note: 'Closest — recommended for out-of-town guests' },
  { name: 'Orange County John Wayne Airport', code: 'SNA', distance: '45 mi' },
  { name: 'Long Beach Airport', code: 'LGB', distance: '53 mi' },
  { name: 'Bob Hope Airport (Burbank)', code: 'BUR', distance: '53 mi' },
  { name: 'Los Angeles International Airport', code: 'LAX', distance: '58 mi',
    note: 'Easiest for international guests' },
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

        {/* Hotels */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl text-dark mb-6">Nearby Hotels</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOTELS.map((hotel) => (
              <div
                key={hotel.name}
                className="bg-white border border-gold/25 rounded-2xl p-5 shadow-sm hover:border-gold/50 hover:shadow-md transition-all flex flex-col"
              >
                <Building2 className="text-gold mb-3" size={22} />
                <p className="font-serif text-base text-dark leading-snug mb-1">{hotel.name}</p>
                <p className="font-sans text-xs text-dark/50 mb-4">{hotel.distance} from venue</p>
                <a
                  href={hotel.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto font-sans text-xs text-rose hover:underline"
                >
                  Book &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Airports */}
        <div>
          <h2 className="font-serif text-2xl text-dark mb-6">Nearby Airports</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {AIRPORTS.map((airport) => (
              <div
                key={airport.code}
                className="bg-white border border-gold/25 rounded-2xl p-5 shadow-sm hover:border-gold/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Plane className="text-gold flex-shrink-0" size={20} />
                  <span className="bg-rose text-cream font-sans text-xs font-bold px-2 py-0.5 rounded-md tracking-wider">
                    {airport.code}
                  </span>
                </div>
                <p className="font-serif text-base text-dark leading-snug mb-1">{airport.name}</p>
                <p className="font-sans text-xs text-dark/50 mb-1">{airport.distance}</p>
                {airport.note && (
                  <p className="font-serif text-sm text-gold italic">{airport.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
