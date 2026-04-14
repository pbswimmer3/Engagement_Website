import type { NextRequest } from 'next/server'

export type InviteGroup = 'praanya' | 'jain' | 'biswas'

export const INVITE_GROUPS: InviteGroup[] = ['praanya', 'jain', 'biswas']

export function isInviteGroup(value: unknown): value is InviteGroup {
  return typeof value === 'string' && (INVITE_GROUPS as string[]).includes(value)
}

/**
 * Read the authenticated invite_group from the `site-auth` cookie.
 * Returns null if the cookie is missing or not one of the valid groups.
 * API routes should treat a null return as unauthorized (401).
 */
export function getInviteGroupFromRequest(req: NextRequest): InviteGroup | null {
  const value = req.cookies.get('site-auth')?.value
  return isInviteGroup(value) ? value : null
}
