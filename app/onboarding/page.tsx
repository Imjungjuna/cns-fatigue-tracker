import { completeOnboarding } from './actions'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 이미 프로필이 있으면 대시보드로 리다이렉트 (maybeSingle은 없어도 에러를 던지지 않음)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  // 프로필이 있고 에러가 없으면 대시보드로 리다이렉트
  if (!profileError && profile) {
    redirect('/dashboard')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">온보딩 정보 입력</CardTitle>
          <CardDescription>
            프로필을 설정하고 피로도 관리를 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={completeOnboarding} className="space-y-6">
            {/* 닉네임 */}
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="예: 철인준"
                required
              />
            </div>

            {/* 목표 (최대 2개) */}
            <div className="space-y-2">
              <Label>현재 집중하고 있는 목표 (최대 2개)</Label>
              <CardDescription className="text-xs">
                같은 name(&quot;goals&quot;)으로 최대 두 개까지 입력됩니다.
              </CardDescription>
              <Input
                name="goals"
                type="text"
                placeholder="예: 시합 피킹"
              />
              <Input
                name="goals"
                type="text"
                placeholder="예: 부상 방지"
              />
            </div>

            {/* 평소 일상 피로도 (1~5) */}
            <div className="space-y-2">
              <Label htmlFor="lifestyleStress">
                평소 일상에서 느끼는 피로도 (1~5)
              </Label>
              <Input
                id="lifestyleStress"
                name="lifestyleStress"
                type="number"
                min={1}
                max={5}
                className="w-full max-w-[120px]"
                placeholder="1~5"
                required
              />
            </div>

            {/* 운동 종목들 (최대 3개) */}
            <div className="space-y-3">
              <Label>운동 종목 (최대 3개)</Label>
              <CardDescription className="text-xs">
                각 종목별로 이름, 주간 횟수(숫자), 경력(텍스트)를 입력합니다.
              </CardDescription>

              {[1, 2, 3].map((idx) => (
                <Card key={idx} className="p-4">
                  <div className="mb-3 text-xs font-semibold text-muted-foreground">
                    종목 {idx}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Input
                      name={`sportName${idx}`}
                      type="text"
                      placeholder="이름 (예: 주짓수)"
                    />
                    <Input
                      name={`sportFrequency${idx}`}
                      type="number"
                      min={0}
                      placeholder="주/횟수 (숫자)"
                    />
                    <Input
                      name={`sportExperience${idx}`}
                      type="text"
                      placeholder="경력 (예: 1~3년)"
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full">
              온보딩 완료
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
