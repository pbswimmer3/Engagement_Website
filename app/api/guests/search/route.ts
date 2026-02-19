import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
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
    const words = [...new Set([term, ...term.split(/\s+/).filter((w) => w.length >= 2)])]

    // Build results from each word, searching both columns
    const searches = await Promise.all(
      words.flatMap((w) => [
        supabase
          .from('guests')
          .select('id, first_name, last_name')
          .ilike('first_name', `%${w}%`)
          .limit(8),
        supabase
          .from('guests')
          .select('id, first_name, last_name')
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
