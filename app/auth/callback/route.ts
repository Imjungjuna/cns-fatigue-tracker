import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // 프로필이 있는지 확인 (maybeSingle은 없어도 에러를 던지지 않음)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        // 에러가 발생하거나 프로필이 없으면 온보딩으로, 있으면 대시보드로
        const redirectTo = (profileError || !profile) ? '/onboarding' : '/dashboard'
        return NextResponse.redirect(`${origin}${redirectTo}`)
      }
    }
  }

  // 에러 발생 시 에러 페이지로
  return NextResponse.redirect(`${origin}/error`)
}
