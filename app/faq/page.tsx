'use client'

import { useState } from 'react'

// ─── ADD / EDIT YOUR FAQ ITEMS HERE ──────────────────────────────────────────
const FAQS = [
  {
    q: 'What is the dress code?',
    a: 'We would greatly appreciate adherence to the dress code:\n• Men: Western Formal\n• Women: Indian or Indo-Western\n\nPlease avoid wearing outfits which are all-gold.',
  },
  {
    q: 'Are you accepting gifts?',
    a: 'We are so grateful to have you celebrate this milestone with us. If you are thinking of bringing a gift, we humbly request no boxed gifts.',
  },
  {
    q: 'Will food be served?',
    a: 'Yes, we will be serving a wide spread of Indian cuisine in both vegetarian and non-vegetarian options, complemented by an open bar.',
  },
  {
    q: 'Is parking available?',
    a: 'Yes, there is plenty of free self-parking available at the venue.',
  },
  {
    q: 'When is the RSVP deadline?',
    a: 'The RSVP deadline is May 1st. If you have extenuating circumstances and cannot confirm by May 1st, please let us know.',
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
          <p className="font-serif italic text-navy/90 text-lg">
            Have a question not answered here? Please reach out.
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
                    <p className="font-sans text-sm text-dark/90 leading-relaxed whitespace-pre-line">
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
