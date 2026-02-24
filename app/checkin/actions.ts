'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { calculateDemoCnsScore } from '@/utils/cns-calculator-demo'

export async function submitCheckin(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const sleepHoursRaw = formData.get('sleepHours')
  const sleepQualityRaw = formData.get('sleepQuality')
  const mentalFatigueRaw = formData.get('mentalFatigue')
  const physicalEnergyRaw = formData.get('physicalEnergy')
  const muscleSorenessRaw = formData.get('muscleSoreness')
  const exercisedYesterday = formData.get('exercisedYesterday') === 'true'
  const prevRpeRaw = formData.get('prevRpe')
  const prevExerciseType = formData.get('prevExerciseType')
  const hrvKnown = formData.get('hrvKnown') === 'on'
  const hrvValueRaw = formData.get('hrvValue')
  const memo = formData.get('memo')

  const sleepHours = sleepHoursRaw ? Number(sleepHoursRaw) : null
  const sleepQuality = sleepQualityRaw ? Number(sleepQualityRaw) : null
  const mentalFatigue = mentalFatigueRaw ? Number(mentalFatigueRaw) : null
  const physicalEnergy = physicalEnergyRaw ? Number(physicalEnergyRaw) : null
  const muscleSoreness = muscleSorenessRaw ? Number(muscleSorenessRaw) : null
  const prevRpe = prevRpeRaw ? Number(prevRpeRaw) : 0
  const hrvValue = hrvKnown && hrvValueRaw ? Number(hrvValueRaw) : null

  if (
    sleepHours == null ||
    sleepQuality == null ||
    mentalFatigue == null ||
    physicalEnergy == null ||
    muscleSoreness == null
  ) {
    throw new Error('필수 항목을 모두 입력해 주세요.')
  }

  const cnsScore = calculateDemoCnsScore({
    sleepDuration: sleepHours,
    sleepQuality,
    mentalCondition: mentalFatigue,
    physicalEnergy,
    muscleSoreness,
    didExercise: exercisedYesterday,
    yesterdayRpe: exercisedYesterday ? prevRpe : 0,
    hrv: hrvValue ?? undefined,
  })

  const payload = {
    user_id: user.id,
    date: new Date().toISOString().slice(0, 10),
    sleep_hours: sleepHours,
    sleep_quality: sleepQuality,
    mental_fatigue: mentalFatigue,
    physical_energy: physicalEnergy,
    muscle_soreness: muscleSoreness,
    exercised_yesterday: exercisedYesterday,
    prev_rpe: exercisedYesterday ? prevRpe : null,
    prev_exercise_type: exercisedYesterday && prevExerciseType ? String(prevExerciseType).trim() || null : null,
    hrv: hrvValue,
    memo: memo ? String(memo).trim() || null : null,
    cns_score: cnsScore,
  }

  const { error } = await supabase.from('daily_records').insert(payload)
  if (error) {
    console.error('Checkin insert error:', error)
    throw new Error('기록 저장에 실패했습니다.')
  }

  redirect('/dashboard')
}
