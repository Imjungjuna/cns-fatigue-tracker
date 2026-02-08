'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function saveOnboardingData(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 1. 프로필 정보 삽입
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      nickname: data.nickname,
      goals: data.goals,
      lifestyle_stress: data.lifestyleStress,
    })

  if (profileError) throw profileError

  // 2. 운동 종목 정보 삽입 (최대 3개)
  const sportsData = data.sports.map((s: any) => ({
    user_id: user.id,
    sport_name: s.name,
    weekly_frequency: s.frequency,
    experience_level: s.experience,
  }))

  const { error: sportsError } = await supabase
    .from('user_sports')
    .insert(sportsData)

  if (sportsError) throw sportsError

  redirect('/dashboard')
}