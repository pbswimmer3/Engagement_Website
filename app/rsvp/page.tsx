'use client'

import { useState } from 'react'

type Step = 'search' | 'confirm_group' | 'verify' | 'rsvp' | 'success'
type Guest = { id: string; first_name: string; last_name: string; invitation_group: string | null }
type GroupMember = { id: string; first_name: string; last_name: string; rsvp_status: string }
type RsvpChoice = 'attending' | 'not_attending'

const STEP_LABELS: Record<string, string> = {
  search: 'Find Name',
  confirm_group: 'Find Name',
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
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [rsvpChoices, setRsvpChoices] = useState<Record<string, RsvpChoice>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // For the confirmation step: show other group members found via search
  const [groupPreview, setGroupPreview] = useState<Guest[]>([])

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

  const handleSelectGuest = async (guest: Guest) => {
    setSelected(guest)
    setError('')

    if (guest.invitation_group) {
      // Find other members in the same group from search results,
      // or fetch them to show the confirmation
      const others = results.filter(
        (g) => g.invitation_group === guest.invitation_group && g.id !== guest.id
      )

      if (others.length > 0) {
        setGroupPreview(others)
        setStep('confirm_group')
        return
      }

      // If others weren't in search results, fetch the full group
      try {
        setLoading(true)
        const res = await fetch('/api/guests/group', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invitation_group: guest.invitation_group }),
        })
        const data = await res.json()
        if (res.ok && data.members) {
          const othersFromGroup = data.members.filter(
            (g: Guest) => g.id !== guest.id
          )
          if (othersFromGroup.length > 0) {
            setGroupPreview(othersFromGroup)
            setStep('confirm_group')
            return
          }
        }
      } catch {
        // Continue to verify even if preview fetch fails
      } finally {
        setLoading(false)
      }
    }

    // No group or solo guest — go straight to verify
    setStep('verify')
  }

  const handleConfirmGroup = () => {
    setStep('verify')
    setError('')
  }

  const handleNotMyGroup = () => {
    // Reset and let user search again
    setSelected(null)
    setGroupPreview([])
    setStep('search')
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

      // Set group members and initialize RSVP choices
      const members: GroupMember[] = data.group_members ?? []
      setGroupMembers(members)

      const initialChoices: Record<string, RsvpChoice> = {}
      members.forEach((m) => {
        if (m.rsvp_status === 'attending' || m.rsvp_status === 'not_attending') {
          initialChoices[m.id] = m.rsvp_status
        }
      })
      setRsvpChoices(initialChoices)

      setStep('rsvp')
    } catch {
      setError("That email doesn't match our records. Please double-check or contact us.")
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async () => {
    if (!selected || groupMembers.length === 0) return

    // Check all members have a choice
    const allChosen = groupMembers.every((m) => rsvpChoices[m.id])
    if (!allChosen) {
      setError('Please select a response for each person.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const rsvps = groupMembers.map((m) => ({
        guest_id: m.id,
        rsvp_status: rsvpChoices[m.id],
      }))

      const res = await fetch('/api/guests/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          email: email.trim().toLowerCase(),
          rsvps,
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

  const setChoice = (guestId: string, choice: RsvpChoice) => {
    setRsvpChoices((prev) => ({ ...prev, [guestId]: choice }))
  }

  // For the stepper, map confirm_group to search position
  const stepForIndicator = step === 'confirm_group' ? 'search' : step

  const anyAttending = Object.values(rsvpChoices).some((s) => s === 'attending')

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl text-darkdenim mb-3">RSVP</h1>
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
              const currentIndex = STEP_ORDER.indexOf(
                stepForIndicator as (typeof STEP_ORDER)[number]
              )
              const isDone = currentIndex > i
              const isActive = stepForIndicator === s
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-bold border-2 transition-colors ${
                      isActive
                        ? 'bg-navy border-navy text-cream'
                        : isDone
                        ? 'bg-gold/30 border-gold text-dark/60'
                        : 'border-dark/20 text-dark/25'
                    }`}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-xs font-sans uppercase tracking-wider hidden sm:block ${
                      isActive ? 'text-navy' : 'text-dark/35'
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
            <p className="font-serif text-xl text-center text-dark/90 italic">
              Search for your name to get started. Please RSVP by May 1st. If you have any trouble, contact us directly!
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="First or last name..."
                className="flex-1 px-4 py-3 border border-gold/40 rounded-xl bg-white font-serif text-dark placeholder:text-dark/30 focus:outline-none focus:border-navy transition-colors"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-navy text-cream font-sans text-xs uppercase tracking-wider rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>

            {error && (
              <p className="text-center text-sm text-navy/80 font-sans">{error}</p>
            )}

            {results.length > 0 && (
              <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm">
                <p className="font-sans text-xs uppercase tracking-wider text-dark/40 text-center">
                  Select your name
                </p>
                {results.map((guest) => (
                  <button
                    key={guest.id}
                    onClick={() => handleSelectGuest(guest)}
                    className="w-full px-6 py-4 border border-gold/30 rounded-xl text-left font-serif text-lg text-dark hover:border-navy hover:bg-navy-light/40 transition-colors"
                  >
                    {guest.first_name} {guest.last_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1b: Confirm Group ── */}
        {step === 'confirm_group' && selected && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="font-serif text-xl text-dark/90">
                Hi,{' '}
                <span className="text-navy">
                  {selected.first_name} {selected.last_name}
                </span>
              </p>
              <p className="font-serif text-base text-dark/90 italic mt-3">
                Are you part of the invitation with:
              </p>
            </div>

            <div className="bg-white border border-gold/25 rounded-2xl px-6 py-5 space-y-2">
              {groupPreview.map((g) => (
                <div
                  key={g.id}
                  className="font-serif text-lg text-navy flex items-center gap-2"
                >
                  <span className="text-gold">&#9670;</span>
                  {g.first_name} {g.last_name}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNotMyGroup}
                className="flex-1 px-6 py-3 border border-gold/40 text-dark/90 font-sans text-xs uppercase tracking-wider rounded-xl hover:border-navy transition-colors"
              >
                No, that&apos;s not me
              </button>
              <button
                onClick={handleConfirmGroup}
                className="flex-1 px-6 py-3 bg-navy text-cream font-sans text-xs uppercase tracking-wider rounded-xl hover:bg-navy-dark transition-colors"
              >
                Yes, that&apos;s us!
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Verify Email ── */}
        {step === 'verify' && selected && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="font-serif text-xl text-dark/70">
                Hi,{' '}
                <span className="text-navy">
                  {selected.first_name} {selected.last_name}
                </span>
              </p>
              <p className="font-serif text-base text-dark/90 italic mt-2">
                Please enter an email address associated with your invitation.
              </p>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gold/40 rounded-xl bg-white font-serif text-dark placeholder:text-dark/30 focus:outline-none focus:border-navy transition-colors"
            />
            {error && (
              <p className="text-center text-sm text-navy/80 font-sans">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setStep('search'); setError('') }}
                className="flex-1 px-6 py-3 border border-gold/40 text-dark/55 font-sans text-xs uppercase tracking-wider rounded-xl hover:border-navy transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleVerify}
                disabled={loading || !email.trim()}
                className="flex-1 px-6 py-3 bg-navy text-cream font-sans text-xs uppercase tracking-wider rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: RSVP ── */}
        {step === 'rsvp' && selected && (
          <div className="space-y-6">
            {groupMembers.length > 1 && (
              <p className="font-serif text-lg text-center text-dark/90 italic">
                Please RSVP for each member of your party
              </p>
            )}

            {groupMembers.length === 1 && (
              <p className="font-serif text-xl text-center text-dark/65">
                Will you be joining us?
              </p>
            )}

            {groupMembers.map((member) => {
              const choice = rsvpChoices[member.id] ?? ''
              const hasPrior =
                member.rsvp_status === 'attending' || member.rsvp_status === 'not_attending'

              return (
                <div
                  key={member.id}
                  className="bg-white border border-gold/25 rounded-2xl px-5 py-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg text-navy">
                      {member.first_name} {member.last_name}
                    </span>
                    {hasPrior && (
                      <span className="font-sans text-xs text-dark/40 uppercase tracking-wider">
                        Currently: {member.rsvp_status === 'attending' ? 'Attending' : 'Not Attending'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setChoice(member.id, 'attending')}
                      className={`p-4 border-2 rounded-xl text-center transition-colors ${
                        choice === 'attending'
                          ? 'border-navy bg-navy-light text-navy'
                          : 'border-gold/30 hover:border-navy/50 text-dark/65'
                      }`}
                    >
                      <div className="text-2xl mb-1">&#127881;</div>
                      <div className="font-serif text-base">Accepts</div>
                    </button>
                    <button
                      onClick={() => setChoice(member.id, 'not_attending')}
                      className={`p-4 border-2 rounded-xl text-center transition-colors ${
                        choice === 'not_attending'
                          ? 'border-navy bg-navy-light text-navy'
                          : 'border-gold/30 hover:border-navy/50 text-dark/65'
                      }`}
                    >
                      <div className="text-2xl mb-1">&#128140;</div>
                      <div className="font-serif text-base">Declines</div>
                    </button>
                  </div>
                </div>
              )
            })}

            {error && (
              <p className="text-center text-sm text-navy/80 font-sans">{error}</p>
            )}

            <button
              onClick={handleRSVP}
              disabled={loading || !groupMembers.every((m) => rsvpChoices[m.id])}
              className="w-full px-6 py-4 bg-navy text-cream font-sans text-xs uppercase tracking-widest rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : groupMembers.length > 1 ? 'Submit RSVPs' : 'Submit RSVP'}
            </button>
          </div>
        )}

        {/* ── Success ── */}
        {step === 'success' && selected && (
          <div className="text-center space-y-6 py-10">
            <div className="text-6xl">
              {anyAttending ? '🎊' : '💌'}
            </div>
            <h2 className="font-serif text-3xl text-dark">
              {anyAttending ? "We can't wait to celebrate with you!" : "We'll miss you!"}
            </h2>

            {groupMembers.length > 1 ? (
              <div className="space-y-3">
                {groupMembers.map((m) => (
                  <p key={m.id} className="font-serif text-lg text-dark/55">
                    {m.first_name} {m.last_name} —{' '}
                    <span className={rsvpChoices[m.id] === 'attending' ? 'text-navy' : 'text-dark/40'}>
                      {rsvpChoices[m.id] === 'attending' ? 'Attending' : 'Not Attending'}
                    </span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="font-serif text-lg text-dark/90 italic">
                {anyAttending
                  ? `Thank you, ${selected.first_name}! We're so excited to celebrate with you.`
                  : `Thank you for letting us know, ${selected.first_name}. You will be missed!`}
              </p>
            )}

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
