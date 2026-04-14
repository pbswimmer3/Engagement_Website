import { NextRequest, NextResponse } from 'next/server'
import { isInviteGroup } from '@/lib/invite-group'

const PUBLIC_PATHS = ['/password', '/api/auth', '/favicon.ico']
const PUBLIC_PREFIXES = ['/_next/', '/assets/', '/photos/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next()
  }

  // The cookie value is the invite_group slug (praanya | jain | biswas).
  // Any other value — including the legacy 'ok' — is treated as unauthenticated,
  // which also locks the RSVP page until a group is stored.
  if (isInviteGroup(request.cookies.get('site-auth')?.value)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/password'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
