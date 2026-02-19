'use client'

// ─── ADD YOUR PHOTOS ─────────────────────────────────────────────────────────
// 1. Drop your photo files into the public/photos/ folder
// 2. Add the filenames to this array (they'll appear in this order)
// Photos can be .jpg, .jpeg, .png, or .webp
const PHOTOS = [
  '/photos/photo-1.jpg',
  '/photos/photo-2.jpg',
  '/photos/photo-3.jpg',
  '/photos/photo-4.jpg',
  '/photos/photo-5.jpg',
  '/photos/photo-6.jpg',
  '/photos/photo-7.jpg',
  '/photos/photo-8.jpg',
]
// ─────────────────────────────────────────────────────────────────────────────

// Gradient placeholders shown while photos are loading or missing
const GRADIENTS = [
  'from-rose-light to-rose/30',
  'from-gold/20 to-gold/40',
  'from-rose/20 to-rose-dark/20',
  'from-cream to-rose-light',
  'from-gold/30 to-rose/20',
  'from-rose-light to-gold/20',
  'from-rose/20 to-cream',
  'from-gold/20 to-rose-light',
]

export default function PhotoGallery() {
  // Duplicate array to create seamless infinite scroll loop
  const track = [...PHOTOS, ...PHOTOS]

  return (
    <div className="overflow-hidden py-2">
      <div className="marquee-track gap-5 px-4">
        {track.map((src, i) => (
          <div
            key={i}
            className={`relative w-56 h-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-gradient-to-br ${
              GRADIENTS[i % GRADIENTS.length]
            }`}
          >
            <img
              src={src}
              alt={`Photo ${(i % PHOTOS.length) + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Gracefully hide broken images — gradient placeholder shows through
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
