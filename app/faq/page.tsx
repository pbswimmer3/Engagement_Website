'use client'

import { useState } from 'react'

// ─── ADD / EDIT YOUR FAQ ITEMS HERE ──────────────────────────────────────────
const FAQS = [
  {
    q: 'What should I wear?',
    a: 'Smart casual or semi-formal attire is recommended. Think cocktail dress or dress shirt with trousers. We want everyone to feel comfortable and celebrate in style!',
  },
  {
    q: 'Is parking available?',
    a: '[Add parking details here — e.g. "Free parking is available in the venue car park off Main Street."]',
  },
  {
    q: 'Will food and drinks be served?',
    a: '[Add catering details — e.g. "Yes! We will be serving a selection of canapés, a sit-down dinner, and drinks throughout the evening."]',
  },
  {
    q: 'Can I bring a plus one?',
    a: 'Our venue has limited capacity, so we kindly ask that only guests named on the invitation attend. If you have any questions, please reach out to us directly.',
  },
  {
    q: 'When is the RSVP deadline?',
    a: '[Add deadline — e.g. "Please RSVP by 15th March 2025 so we can plan accordingly. You can RSVP on this website!"]',
  },
  {
    q: 'Are children welcome?',
    a: '[Add your policy — e.g. "We love children! Little ones are welcome at the celebration." or "This is an adults-only event — we appreciate your understanding."]',
  },
  {
    q: 'How do I contact you?',
    a: '[Add contact details — e.g. "Feel free to reach out at hello@example.com or text Prad on +44 000 000 0000."]',
  },
]
// ─────────────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="font-serif text-5xl text-dark mb-3">
            Frequently Asked Questions
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="block w-16 h-px bg-gold/60" />
            <span className="text-gold text-sm">&#9670;</span>
            <span className="block w-16 h-px bg-gold/60" />
          </div>
          <p className="font-serif italic text-dark/45 text-lg">
            Have a question not answered here? Just reach out.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="border border-gold/25 rounded-2xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-rose-light/30 transition-colors group"
              >
                <span className="font-serif text-lg text-dark pr-4 group-hover:text-rose transition-colors">
                  {item.q}
                </span>
                <span
                  className={`text-gold text-2xl transition-transform duration-200 flex-shrink-0 leading-none ${
                    open === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gold/15 pt-4">
                    <p className="font-sans text-sm text-dark/60 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
