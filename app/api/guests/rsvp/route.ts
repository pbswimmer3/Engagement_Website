import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const VALID_STATUSES = ['attending', 'not_attending']

export async function POST(req: NextRequest) {
  try {
    const { id, email, rsvps } = await req.json()
    // rsvps: Array<{ guest_id: string; rsvp_status: 'attending' | 'not_attending' }>

    if (!id || !email || !rsvps || !Array.isArray(rsvps) || rsvps.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate all statuses
    for (const r of rsvps) {
      if (!r.guest_id || !VALID_STATUSES.includes(r.rsvp_status)) {
        return NextResponse.json({ error: 'Invalid RSVP data' }, { status: 400 })
      }
    }

    const supabase = createAdminClient()

    // Re-verify email: the authenticated guest must belong to the group
    const { data: authGuest, error: findError } = await supabase
      .from('guests')
      .select('id, email, invitation_group')
      .eq('id', id)
      .single()

    if (findError || !authGuest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    // Verify the email matches this guest or a group member
    let emailMatched = false
    if (authGuest.email && authGuest.email.toLowerCase() === email.toLowerCase()) {
      emailMatched = true
    } else if (authGuest.invitation_group) {
      const { data: groupEmails } = await supabase
        .from('guests')
        .select('email')
        .eq('invitation_group', authGuest.invitation_group)
        .not('email', 'is', null)

      if (groupEmails) {
        emailMatched = groupEmails.some(
          (m) => m.email && m.email.toLowerCase() === email.toLowerCase()
        )
      }
    }

    if (!emailMatched) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build set of allowed guest IDs (only this guest + their group members)
    const allowedIds = new Set<string>()
    if (authGuest.invitation_group) {
      const { data: groupMembers } = await supabase
        .from('guests')
        .select('id')
        .eq('invitation_group', authGuest.invitation_group)

      groupMembers?.forEach((m) => allowedIds.add(m.id))
    } else {
      allowedIds.add(authGuest.id)
    }

    // Verify all submitted guest_ids are in the allowed set
    for (const r of rsvps) {
      if (!allowedIds.has(r.guest_id)) {
        return NextResponse.json({ error: 'Unauthorized guest in RSVP' }, { status: 401 })
      }
    }

    // Update each guest's RSVP status
    const now = new Date().toISOString()
    const updates = rsvps.map((r: { guest_id: string; rsvp_status: string }) =>
      supabase
        .from('guests')
        .update({ rsvp_status: r.rsvp_status, updated_at: now })
        .eq('id', r.guest_id)
    )

    const results = await Promise.all(updates)
    const failed = results.find((r) => r.error)
    if (failed?.error) throw failed.error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('RSVP update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
