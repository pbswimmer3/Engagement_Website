import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { id, email } = await req.json()

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('guests')
      .select('id, email, rsvp_status')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    if (data.email.toLowerCase() !== email.toLowerCase()) {
      // Return a generic error to avoid confirming whether the guest exists
      return NextResponse.json({ error: 'Email does not match' }, { status: 401 })
    }

    return NextResponse.json({ rsvp_status: data.rsvp_status })
  } catch (err) {
    console.error('Guest verify error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
