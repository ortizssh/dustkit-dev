import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')

  // If there's already an error parameter, redirect to error page
  if (error) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Auth exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(exchangeError.message)}`)
      }

      if (data?.session) {
        // Successful authentication
        const redirectUrl = new URL(next, origin)
        const response = NextResponse.redirect(redirectUrl)
        
        // Set additional security headers
        response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        
        return response
      }
    } catch (error) {
      console.error('Unexpected auth error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected_error`)
    }
  }

  // No code parameter provided
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=missing_code`)
}