'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// FormData를 직접 받아 .get / .getAll로 파싱하는 온보딩 서버 액션
export async function completeOnboarding(formData: FormData) {
  const nickname = String(formData.get('nickname') ?? '').trim()

  const goals = formData
    .getAll('goals')
    .map((g) => String(g).trim())
    .filter((g) => g.length > 0)

  const lifestyleStressRaw = formData.get('lifestyleStress')
  const lifestyleStress = lifestyleStressRaw ? Number(lifestyleStressRaw) : 0

  const sports: { name: string; frequency: string; experience: string }[] = []

  for (let i = 1; i <= 3; i++) {
    const name = String(formData.get(`sportName${i}`) ?? '').trim()
    if (!name) continue

    const frequency = String(formData.get(`sportFrequency${i}`) ?? '').trim()
    const experience = String(
      formData.get(`sportExperience${i}`) ?? ''
    ).trim()

    if (frequency && experience) {
      sports.push({ name, frequency, experience })
    }
  }

  const data = {
    nickname,
    goals,
    lifestyleStress,
    sports,
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. 데이터 유효성 검사 (서버측 방어 코드)
  if (data.goals.length > 2) throw new Error('You can select up to 2 goals.')
  if (data.sports.length > 3) throw new Error('You can select up to 3 sports.')
  if (!data.lifestyleStress || data.lifestyleStress < 1 || data.lifestyleStress > 5) {
    throw new Error('Please select a fatigue level.')
  }

  // 2. profiles upsert (없으면 생성, 있으면 업데이트)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      nickname: data.nickname,
      goals: data.goals,
      lifestyle_stress: data.lifestyleStress,
    })

  if (profileError) throw profileError

  // 3. 기존 user_sports 데이터 삭제 (중복 방지)
  const { error: deleteError } = await supabase
    .from('user_sports')
    .delete()
    .eq('user_id', user.id)

  if (deleteError) throw deleteError

  // 4. user_sports 데이터 가공 및 삽입
  if (data.sports.length > 0) {
    // frequency 문자열을 숫자로 변환하는 함수
    const parseFrequency = (freq: string): number => {
      if (freq === '1x/week') return 1
      if (freq === '2-3x/week') return 2 // 또는 3, 평균값 2 사용
      if (freq === '4+ times/week') return 4
      return 1 // 기본값
    }

    const sportsData = data.sports.map((s: { name: string; frequency: string; experience: string }) => ({
      user_id: user.id,
      sport_name: s.name,
      weekly_frequency: parseFrequency(s.frequency),
      experience_level: s.experience,
    }))

    const { error: sportsError } = await supabase
      .from('user_sports')
      .insert(sportsData)

    if (sportsError) throw sportsError
  }

  redirect('/dashboard')
}
