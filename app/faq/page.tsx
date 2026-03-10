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
    a: 'Yes parking will be available, though we encourage guests to uber.',
  },
  {
    q: 'Will food and drinks be served?',
    a: 'Of course, we have a full catering providing dinner and an open bar throughout the evening.[Add catering details — e.g. "Yes! We will be serving a selection of canapés, a sit-down dinner, and drinks throughout the evening."]',
  },
  {
    q: 'Can I bring a plus one?',
    a: 'Our venue has limited capacity, so we kindly ask that only guests named on the invitation attend. If you have any questions, please reach out to us directly.',
  },
  {
    q: 'When is the RSVP deadline?',
    a: 'Please RSVP by April 1st, 2026 so we can plan accordingly. You can RSVP on this website!"]',
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
          <h1 className="font-serif text-5xl text-darkdenim mb-3">
            Frequently Asked Questions
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="block w-16 h-px bg-gold/60" />
            <span className="text-gold text-sm">&#9670;</span>
            <span className="block w-16 h-px bg-gold/60" />
          </div>
          <p className="font-serif italic text-navy/60 text-lg">
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
                className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-navy-light/30 transition-colors group"
              >
                <span className="font-serif text-lg text-darkdenim pr-4 group-hover:text-navy transition-colors">
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
