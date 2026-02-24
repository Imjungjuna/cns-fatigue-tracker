import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogoutButton } from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 프로필 정보 가져오기 (온보딩 완료 여부 포함)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // 프로필 없음/에러/온보딩 미완료 시 온보딩으로 리다이렉트
  if (profileError || !profile || !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  // 사용자 운동 종목 가져오기
  const { data: sports } = await supabase
    .from('user_sports')
    .select('*')
    .eq('user_id', user.id)

  // 최근 7일 일지 (RPE 타임라인용)
  const { data: recentRecords } = await supabase
    .from('daily_records')
    .select('date, exercised_yesterday, prev_rpe, prev_exercise_type, cns_score')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(7)

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              환영합니다, {profile.nickname || '사용자'}님!
            </h1>
            <p className="mt-2 text-muted-foreground">
              CNS 피로도 추적 대시보드
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/checkin">체크인하기</Link>
            </Button>
            <LogoutButton />
          </div>
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
              <Button asChild variant="outline" className="w-full justify-center">
                <Link href="/checkin">체크인하기</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                피로도 기록, 데이터 분석 등의 기능이 여기에 표시됩니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 최근 7일 RPE 타임라인 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>최근 7일 RPE</CardTitle>
            <CardDescription>날짜별 운동 부하 (RPE 1~10, 미운동 시 휴식)</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecords && recentRecords.length > 0 ? (
              <div className="relative">
                {/* 세로 연결선 */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" aria-hidden />
                <ul className="space-y-0">
                  {recentRecords.map((record) => (
                    <li key={record.date} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* 타임라인 점 */}
                      <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                        <span className="text-[10px] font-semibold text-primary">
                          {record.prev_rpe ?? '-'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="font-medium text-foreground">
                          {record.date}
                          {record.exercised_yesterday && record.prev_exercise_type && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                              · {record.prev_exercise_type}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.exercised_yesterday
                            ? `RPE ${record.prev_rpe ?? '-'}`
                            : '휴식'}
                          {record.cns_score != null && (
                            <span className="ml-2">· CNS {record.cns_score}</span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                아직 기록이 없습니다. 체크인을 시작해 보세요.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
