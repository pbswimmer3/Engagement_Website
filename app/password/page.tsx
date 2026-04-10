'use client'

import { useState } from 'react'

export default function PasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        // Hard navigation so the root layout (Navbar, fonts) loads cleanly
        window.location.href = '/'
      } else {
        setError('Incorrect password. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-xs uppercase tracking-[0.5em] text-gold mb-6">
        Engagement Celebration
      </p>

      <h1 className="font-script text-5xl sm:text-6xl text-rose leading-none mb-3">
        Aanya &amp; Prad
      </h1>

      <div className="flex items-center gap-4 mb-8">
        <span className="block w-16 h-px bg-gold/60" />
        <span className="text-gold text-sm">&#9670;</span>
        <span className="block w-16 h-px bg-gold/60" />
      </div>

      <p className="font-serif italic text-dark/60 mb-8 text-lg">
        Please enter the password from your invitation
      </p>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Password"
          className="w-full border border-gold/50 rounded-lg px-4 py-3 text-center font-sans text-sm text-dark bg-white focus:outline-none focus:border-rose transition-colors placeholder:text-dark/30"
        />

        {error && (
          <p className="font-sans text-sm text-rose/80">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={loading || !password}
          className="bg-rose text-cream font-sans text-xs uppercase tracking-widest px-8 py-3 rounded-lg hover:bg-rose-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </div>
    </div>
  )
}
