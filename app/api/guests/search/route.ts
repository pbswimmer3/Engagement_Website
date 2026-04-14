import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getInviteGroupFromRequest } from '@/lib/invite-group'

export async function POST(req: NextRequest) {
  try {
    const inviteGroup = getInviteGroupFromRequest(req)
    if (!inviteGroup) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const term = query.trim()
    const supabase = createAdminClient()

    // Search individual words so "John Smith" matches first OR last name
    const words = Array.from(new Set([term, ...term.split(/\s+/).filter((w) => w.length >= 2)]))

    // Build results from each word, searching both columns. Every query is
    // scoped to the caller's invite_group so e.g. a Biswas visitor cannot
    // enumerate Jain or Praanya guests.
    const searches = await Promise.all(
      words.flatMap((w) => [
        supabase
          .from('guests')
          .select('id, first_name, last_name, invitation_group')
          .eq('invite_group', inviteGroup)
          .ilike('first_name', `%${w}%`)
          .limit(8),
        supabase
          .from('guests')
          .select('id, first_name, last_name, invitation_group')
          .eq('invite_group', inviteGroup)
          .ilike('last_name', `%${w}%`)
          .limit(8),
      ])
    )

    // Merge and deduplicate by id
    const seen = new Set<string>()
    const guests = searches
      .flatMap((r) => r.data ?? [])
      .filter((g) => !seen.has(g.id) && seen.add(g.id))
      .slice(0, 10)

    return NextResponse.json({ guests })
  } catch (err) {
    console.error('Guest search error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
