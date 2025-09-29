import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error)
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 500 }
      )
    }

    // Redirect to home page after successful sign out
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('Unexpected sign out error:', error)
    return NextResponse.json(
      { error: 'Unexpected error during sign out' },
      { status: 500 }
    )
  }
}

// Also support GET for simple link-based sign out
export async function GET() {
  return POST()
}