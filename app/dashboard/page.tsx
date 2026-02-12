import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LogoutButton } from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 프로필 정보 가져오기 (maybeSingle은 없어도 에러를 던지지 않음)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // 프로필이 없거나 에러가 발생하면 온보딩으로 리다이렉트
  if (profileError || !profile) {
    redirect('/onboarding')
  }

  // 사용자 운동 종목 가져오기
  const { data: sports } = await supabase
    .from('user_sports')
    .select('*')
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              환영합니다, {profile.nickname || '사용자'}님!
            </h1>
            <p className="mt-2 text-muted-foreground">
              CNS 피로도 추적 대시보드
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 프로필 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>내 기본 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">닉네임</p>
                <p className="text-lg font-semibold">{profile.nickname || '미설정'}</p>
              </div>
              {profile.goals && profile.goals.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">목표</p>
                  <ul className="list-disc list-inside">
                    {profile.goals.map((goal: string, index: number) => (
                      <li key={index} className="text-sm">{goal}</li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.lifestyle_stress && (
                <div>
                  <p className="text-sm text-muted-foreground">일상 피로도</p>
                  <p className="text-lg font-semibold">{profile.lifestyle_stress}/5</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 운동 종목 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>운동 종목</CardTitle>
              <CardDescription>등록된 운동 종목</CardDescription>
            </CardHeader>
            <CardContent>
              {sports && sports.length > 0 ? (
                <div className="space-y-3">
                  {sports.map((sport) => (
                    <div key={sport.id} className="border-b border-border pb-3 last:border-0">
                      <p className="font-semibold">{sport.sport_name}</p>
                      <p className="text-sm text-muted-foreground">
                        주 {sport.weekly_frequency}회 · {sport.experience_level}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">등록된 운동 종목이 없습니다.</p>
              )}
            </CardContent>
          </Card>

          {/* 빠른 액션 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 액션</CardTitle>
              <CardDescription>자주 사용하는 기능</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                피로도 기록, 데이터 분석 등의 기능이 여기에 표시됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
