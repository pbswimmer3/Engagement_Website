'use client'

import { useState } from 'react'

type Step = 'search' | 'verify' | 'rsvp' | 'success'
type Guest = { id: string; first_name: string; last_name: string }
type RsvpStatus = 'attending' | 'not_attending'

const STEP_LABELS: Record<string, string> = {
  search: 'Find Name',
  verify: 'Verify Email',
  rsvp: 'RSVP',
}
const STEP_ORDER: Step[] = ['search', 'verify', 'rsvp']

export default function RSVPPage() {
  const [step, setStep] = useState<Step>('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Guest[]>([])
  const [selected, setSelected] = useState<Guest | null>(null)
  const [email, setEmail] = useState('')
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    try {
      const res = await fetch('/api/guests/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.guests)
      if (data.guests.length === 0) {
        setError("We couldn't find that name. Please check the spelling or contact us directly.")
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectGuest = (guest: Guest) => {
    setSelected(guest)
    setStep('verify')
    setError('')
  }

  const handleVerify = async () => {
    if (!email.trim() || !selected) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/guests/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCurrentStatus(data.rsvp_status)
      setStep('rsvp')
    } catch {
      setError("That email doesn't match our records. Please double-check or contact us.")
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async () => {
    if (!rsvpStatus || !selected) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/guests/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          email: email.trim().toLowerCase(),
          rsvp_status: rsvpStatus,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('success')
    } catch {
      setError('Failed to submit RSVP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl text-dark mb-3">RSVP</h1>
          <div className="flex items-center justify-center gap-4">
            <span className="block w-16 h-px bg-gold/60" />
            <span className="text-gold text-sm">&#9670;</span>
            <span className="block w-16 h-px bg-gold/60" />
          </div>
        </div>

        {/* Step indicators */}
        {step !== 'success' && (
          <div className="flex justify-center gap-6 mb-10">
            {STEP_ORDER.map((s, i) => {
              const currentIndex = STEP_ORDER.indexOf(step)
              const isDone = currentIndex > i
              const isActive = step === s
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-bold border-2 transition-colors ${
                      isActive
                        ? 'bg-rose border-rose text-cream'
                        : isDone
                        ? 'bg-gold/30 border-gold text-dark/60'
                        : 'border-dark/20 text-dark/25'
                    }`}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-xs font-sans uppercase tracking-wider hidden sm:block ${
                      isActive ? 'text-rose' : 'text-dark/35'
                    }`}
                  >
                    {STEP_LABELS[s]}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Step 1: Search ── */}
        {step === 'search' && (
          <div className="space-y-6">
            <p className="font-serif text-xl text-center text-dark/55 italic">
              Search for your name to get started
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="First or last name..."
                className="flex-1 px-4 py-3 border border-gold/40 rounded-xl bg-white font-serif text-dark placeholder:text-dark/30 focus:outline-none focus:border-rose transition-colors"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-rose text-cream font-sans text-xs uppercase tracking-wider rounded-xl hover:bg-rose-dark transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>

            {error && (
              <p className="text-center text-sm text-rose/80 font-sans">{error}</p>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <p className="font-sans text-xs uppercase tracking-wider text-dark/40 text-center">
                  Select your name
                </p>
                {results.map((guest) => (
                  <button
                    key={guest.id}
                    onClick={() => handleSelectGuest(guest)}
                    className="w-full px-6 py-4 border border-gold/30 rounded-xl text-left font-serif text-lg text-dark hover:border-rose hover:bg-rose-light/40 transition-colors"
                  >
                    {guest.first_name} {guest.last_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Verify Email ── */}
        {step === 'verify' && selected && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="font-serif text-xl text-dark/70">
                Hi,{' '}
                <span className="text-rose">
                  {selected.first_name} {selected.last_name}
                </span>
              </p>
              <p className="font-serif text-base text-dark/45 italic mt-2">
                Please enter the email address associated with your invitation.
              </p>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gold/40 rounded-xl bg-white font-serif text-dark placeholder:text-dark/30 focus:outline-none focus:border-rose transition-colors"
            />
            {error && (
              <p className="text-center text-sm text-rose/80 font-sans">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setStep('search'); setError('') }}
                className="flex-1 px-6 py-3 border border-gold/40 text-dark/55 font-sans text-xs uppercase tracking-wider rounded-xl hover:border-rose transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleVerify}
                disabled={loading || !email.trim()}
                className="flex-1 px-6 py-3 bg-rose text-cream font-sans text-xs uppercase tracking-wider rounded-xl hover:bg-rose-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: RSVP ── */}
        {step === 'rsvp' && selected && (
          <div className="space-y-6">
            {currentStatus && currentStatus !== 'pending' && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-4 text-center">
                <p className="font-serif text-sm text-dark/60">
                  Your current RSVP:{' '}
                  <span className="text-rose font-medium">
                    {currentStatus === 'attending' ? 'Attending' : 'Not Attending'}
                  </span>
                </p>
                <p className="font-sans text-xs text-dark/40 mt-1">
                  You can update your response below.
                </p>
              </div>
            )}

            <p className="font-serif text-xl text-center text-dark/65">
              Will you be joining us?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRsvpStatus('attending')}
                className={`p-6 border-2 rounded-2xl text-center transition-colors ${
                  rsvpStatus === 'attending'
                    ? 'border-rose bg-rose-light text-rose'
                    : 'border-gold/30 hover:border-rose/50 text-dark/65'
                }`}
              >
                <div className="text-3xl mb-2">&#127881;</div>
                <div className="font-serif text-lg">Joyfully Accepts</div>
                <div className="font-sans text-xs text-dark/40 mt-1 uppercase tracking-wider">
                  I&apos;ll be there!
                </div>
              </button>
              <button
                onClick={() => setRsvpStatus('not_attending')}
                className={`p-6 border-2 rounded-2xl text-center transition-colors ${
                  rsvpStatus === 'not_attending'
                    ? 'border-rose bg-rose-light text-rose'
                    : 'border-gold/30 hover:border-rose/50 text-dark/65'
                }`}
              >
                <div className="text-3xl mb-2">&#128140;</div>
                <div className="font-serif text-lg">Regretfully Declines</div>
                <div className="font-sans text-xs text-dark/40 mt-1 uppercase tracking-wider">
                  Can&apos;t make it
                </div>
              </button>
            </div>

            {error && (
              <p className="text-center text-sm text-rose/80 font-sans">{error}</p>
            )}

            <button
              onClick={handleRSVP}
              disabled={loading || !rsvpStatus}
              className="w-full px-6 py-4 bg-rose text-cream font-sans text-xs uppercase tracking-widest rounded-xl hover:bg-rose-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </div>
        )}

        {/* ── Success ── */}
        {step === 'success' && selected && (
          <div className="text-center space-y-6 py-10">
            <div className="text-6xl">
              {rsvpStatus === 'attending' ? '🎊' : '💌'}
            </div>
            <h2 className="font-serif text-3xl text-dark">
              {rsvpStatus === 'attending' ? "We can't wait to see you!" : "We'll miss you!"}
            </h2>
            <p className="font-serif text-lg text-dark/55 italic">
              {rsvpStatus === 'attending'
                ? `Thank you, ${selected.first_name}! We're so excited to celebrate with you.`
                : `Thank you for letting us know, ${selected.first_name}. You will be missed!`}
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="block w-16 h-px bg-gold/60" />
              <span className="text-gold text-sm">&#9670;</span>
              <span className="block w-16 h-px bg-gold/60" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
