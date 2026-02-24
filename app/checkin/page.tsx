import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckinForm } from '@/components/mine/checkin-form'

export default async function CheckinPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile || !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  const today = new Date().toISOString().slice(0, 10)
  const { data: existingRecord } = await supabase
    .from('daily_records')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle()

  const { data: userSports } = await supabase
    .from('user_sports')
    .select('sport_name')
    .eq('user_id', user.id)

  const sportNames = (userSports ?? []).map((s) => s.sport_name)

  if (existingRecord) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-1">오늘의 체크인</h1>
        <p className="text-muted-foreground text-sm mb-6">
          수면·컨디션·어제 운동을 기록하면 CNS 피로도가 계산됩니다.
        </p>
        <CheckinForm sportNames={sportNames} />
      </div>
    </div>
  )
}
