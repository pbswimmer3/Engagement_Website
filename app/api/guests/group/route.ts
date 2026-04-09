import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { invitation_group } = await req.json()

    if (!invitation_group || typeof invitation_group !== 'string') {
      return NextResponse.json({ error: 'Missing invitation_group' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: members, error } = await supabase
      .from('guests')
      .select('id, first_name, last_name, invitation_group')
      .eq('invitation_group', invitation_group)
      .order('first_name')

    if (error) throw error

    return NextResponse.json({ members: members ?? [] })
  } catch (err) {
    console.error('Group lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
