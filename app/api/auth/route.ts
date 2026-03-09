import { NextRequest, NextResponse } from 'next/server'

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'Forever2026'

export async function POST(request: NextRequest) {
  let body: { password?: string }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  if (!body.password || body.password !== SITE_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('site-auth', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // maxAge: 60 * 60 * 24 * 30,  // Uncomment for persistent 30-day login
  })
  return response
}
