import { NextRequest, NextResponse } from 'next/server'

export type InviteGroup = 'praanya' | 'jain' | 'biswas'

// Per-group passwords. SITE_PASSWORD is kept as a fallback for the Praanya
// group so existing deployments keep working until the new env vars are set.
const GROUP_PASSWORDS: Record<InviteGroup, string | undefined> = {
  praanya: process.env.SITE_PASSWORD_PRAANYA || process.env.SITE_PASSWORD || 'Forever2026',
  jain:    process.env.SITE_PASSWORD_JAIN,
  biswas:  process.env.SITE_PASSWORD_BISWAS,
}

function matchGroup(password: string): InviteGroup | null {
  for (const [group, expected] of Object.entries(GROUP_PASSWORDS)) {
    if (expected && password === expected) return group as InviteGroup
  }
  return null
}

export async function POST(request: NextRequest) {
  let body: { password?: string }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  if (!body.password) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const group = matchGroup(body.password)
  if (!group) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  // Cookie value is the invite_group slug — middleware and API routes use it
  // to scope RSVP lookups to the guests that group was invited by.
  const response = NextResponse.json({ ok: true, invite_group: group })
  response.cookies.set('site-auth', group, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // maxAge: 60 * 60 * 24 * 30,  // Uncomment for persistent 30-day login
  })
  return response
}
