import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const VALID_STATUSES = ['attending', 'not_attending']

export async function POST(req: NextRequest) {
  try {
    const { id, email, rsvp_status } = await req.json()

    if (!id || !email || !rsvp_status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!VALID_STATUSES.includes(rsvp_status)) {
      return NextResponse.json({ error: 'Invalid RSVP status' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Re-verify email before allowing the update (prevents tampering with the guest id)
    const { data: guest, error: findError } = await supabase
      .from('guests')
      .select('id, email')
      .eq('id', id)
      .single()

    if (findError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    if (guest.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error: updateError } = await supabase
      .from('guests')
      .update({ rsvp_status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('RSVP update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
