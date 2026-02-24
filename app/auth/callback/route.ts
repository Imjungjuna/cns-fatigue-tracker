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
        // 온보딩 완료 여부 확인
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle()

        // 에러/프로필 없음/온보딩 미완료 → 온보딩, 완료 시 대시보드
        const redirectTo = (profileError || !profile || !profile.onboarding_completed) ? '/onboarding' : '/dashboard'
        return NextResponse.redirect(`${origin}${redirectTo}`)
      }
    }
  }

  // 에러 발생 시 에러 페이지로
  return NextResponse.redirect(`${origin}/error`)
}
