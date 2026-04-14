import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getInviteGroupFromRequest } from '@/lib/invite-group'

export async function POST(req: NextRequest) {
  try {
    const inviteGroup = getInviteGroupFromRequest(req)
    if (!inviteGroup) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { invitation_group } = await req.json()

    if (!invitation_group || typeof invitation_group !== 'string') {
      return NextResponse.json({ error: 'Missing invitation_group' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Scope to the caller's invite_group — prevents discovering group
    // membership for guests invited by a different side.
    const { data: members, error } = await supabase
      .from('guests')
      .select('id, first_name, last_name, invitation_group')
      .eq('invite_group', inviteGroup)
      .eq('invitation_group', invitation_group)
      .order('first_name')

    if (error) throw error

    return NextResponse.json({ members: members ?? [] })
  } catch (err) {
    console.error('Group lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
