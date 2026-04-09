import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { id, email } = await req.json()

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Look up the selected guest
    const { data: guest, error } = await supabase
      .from('guests')
      .select('id, email, rsvp_status, invitation_group')
      .eq('id', id)
      .single()

    if (error || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    // Verify email: check if the provided email matches this guest's email,
    // OR any email in the same invitation group
    let emailMatched = false

    if (guest.email && guest.email.toLowerCase() === email.toLowerCase()) {
      emailMatched = true
    } else if (guest.invitation_group) {
      // Check if the email belongs to any member of the same group
      const { data: groupMembers } = await supabase
        .from('guests')
        .select('email')
        .eq('invitation_group', guest.invitation_group)
        .not('email', 'is', null)

      if (groupMembers) {
        emailMatched = groupMembers.some(
          (m) => m.email && m.email.toLowerCase() === email.toLowerCase()
        )
      }
    }

    if (!emailMatched) {
      return NextResponse.json({ error: 'Email does not match' }, { status: 401 })
    }

    // Fetch all group members if this guest is in a group
    let groupMembers: { id: string; first_name: string; last_name: string; rsvp_status: string }[] = []

    if (guest.invitation_group) {
      const { data: members } = await supabase
        .from('guests')
        .select('id, first_name, last_name, rsvp_status')
        .eq('invitation_group', guest.invitation_group)
        .order('first_name')

      groupMembers = members ?? []
    } else {
      // Solo guest — just return themselves
      const { data: self } = await supabase
        .from('guests')
        .select('id, first_name, last_name, rsvp_status')
        .eq('id', id)
        .single()

      if (self) groupMembers = [self]
    }

    return NextResponse.json({
      rsvp_status: guest.rsvp_status,
      invitation_group: guest.invitation_group,
      group_members: groupMembers,
    })
  } catch (err) {
    console.error('Guest verify error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
