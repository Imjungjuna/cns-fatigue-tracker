'use client'

import { useState } from 'react'
import { saveOnboardingData } from './actions'

const SPORTS = [
  'MMA',
  '복싱',
  '주짓수',
  '레슬링',
  '무에타이/킥복싱',
  '보디빌딩',
  '파워리프팅',
  '크로스핏',
  '러닝',
  '사이클',
  '수영',
  '클라이밍',
]

const FREQUENCIES = ['1회', '2~3회', '4회 이상']
const EXPERIENCES = ['1년 미만', '1~3년', '3~5년', '5년 이상']

const GOALS = [
  { id: 1, title: '시합 및 퍼포먼스 피킹', subtitle: 'Peaking' },
  { id: 2, title: '스트렝스 및 파워 증량', subtitle: 'Strength/Power' },
  { id: 3, title: '근성장 및 근비대', subtitle: 'Hypertrophy' },
  { id: 4, title: '부상 방지 및 회복 관리', subtitle: 'Injury Prevention' },
  { id: 5, title: '다종목 병행 및 밸런스', subtitle: 'Hybrid Training' },
  { id: 6, title: '체지방 커팅 및 체중 조절', subtitle: 'Weight Management' },
]

const FATIGUE_LEVELS = [
  { value: 'very_low', label: '매우 낮음' },
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
  { value: 'very_high', label: '매우 높음' },
]

type SportData = {
  name: string
  frequency: string
  experience: string
}

export default function OnboardingPage() {
  const [nickname, setNickname] = useState('')
  const [selectedSports, setSelectedSports] = useState<SportData[]>([])
  const [selectedGoals, setSelectedGoals] = useState<number[]>([])
  const [lifestyleStress, setLifestyleStress] = useState<string>('')
  const [expandedSport, setExpandedSport] = useState<string | null>(null)

  const handleSportSelect = (sport: string) => {
    if (selectedSports.find((s) => s.name === sport)) {
      setSelectedSports(selectedSports.filter((s) => s.name !== sport))
      if (expandedSport === sport) setExpandedSport(null)
    } else if (selectedSports.length < 3) {
      setSelectedSports([...selectedSports, { name: sport, frequency: '', experience: '' }])
      setExpandedSport(sport)
    }
  }

  const updateSportData = (sportName: string, field: 'frequency' | 'experience', value: string) => {
    setSelectedSports(
      selectedSports.map((s) => (s.name === sportName ? { ...s, [field]: value } : s))
    )
  }

  const handleGoalToggle = (goalId: number) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((id) => id !== goalId))
    } else if (selectedGoals.length < 2) {
      setSelectedGoals([...selectedGoals, goalId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.')
      return
    }

    if (selectedSports.length === 0) {
      alert('최소 1개 이상의 운동 종목을 선택해주세요.')
      return
    }

    const incompleteSports = selectedSports.filter(
      (s) => !s.frequency || !s.experience
    )
    if (incompleteSports.length > 0) {
      alert('선택한 운동 종목의 횟수와 경력을 모두 입력해주세요.')
      return
    }

    if (selectedGoals.length === 0) {
      alert('최소 1개 이상의 목표를 선택해주세요.')
      return
    }

    if (!lifestyleStress) {
      alert('평소 일상에서 느끼는 피로도를 선택해주세요.')
      return
    }

    await saveOnboardingData({
      nickname,
      sports: selectedSports,
      goals: selectedGoals,
      lifestyleStress,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3">
            <span className="text-3xl">🏋️</span>
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            프로필 설정
          </h1>
          <p className="text-gray-600">맞춤형 피로도 관리를 위한 정보를 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 닉네임 */}
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200/50">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">👤</span>
              <label className="text-base font-semibold text-gray-800">닉네임</label>
            </div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-3.5 text-gray-800 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="앱 안에서 부를 이름을 입력하세요"
            />
            <p className="mt-2 text-xs text-gray-500">앱 안에서 부를 이름</p>
          </div>

          {/* 운동 종목 */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 shadow-md ring-1 ring-orange-200/50">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">💪</span>
              <div>
                <label className="text-base font-semibold text-gray-800">
                  주로 하는 운동과 종목별 주간 횟수, 경력
                </label>
                <p className="text-xs text-gray-600">최대 3개까지 선택 가능</p>
              </div>
            </div>
            <p className="mb-4 text-xs text-gray-600">
              종목별 부하 특성, 빈도, 적응도를 통합하여 개인별 기저 피로도 및 회복 탄력성 정밀 산출
            </p>

            {/* 종목 선택 Chips */}
            <div className="flex flex-wrap gap-2.5">
              {SPORTS.map((sport) => {
                const isSelected = selectedSports.find((s) => s.name === sport)
                const isDisabled = !isSelected && selectedSports.length >= 3
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => handleSportSelect(sport)}
                    disabled={isDisabled}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 scale-105'
                        : isDisabled
                        ? 'border border-gray-300 text-gray-400 cursor-not-allowed opacity-50'
                        : 'border-2 border-orange-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    {sport}
                  </button>
                )
              })}
            </div>

            {/* 선택된 종목의 상세 입력 */}
            {selectedSports.map((sport) => (
              <div
                key={sport.name}
                className="mt-4 rounded-xl border-2 border-orange-200 bg-white p-5 shadow-sm transition-all duration-300"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">{sport.name}</h3>
                  <button
                    type="button"
                    onClick={() => handleSportSelect(sport.name)}
                    className="rounded-lg px-3 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    ✕ 제거
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-gray-600">📅 주간 횟수</label>
                    <div className="flex flex-wrap gap-2">
                      {FREQUENCIES.map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => updateSportData(sport.name, 'frequency', freq)}
                          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                            sport.frequency === freq
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                              : 'border border-orange-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-gray-600">⭐ 경력</label>
                    <div className="flex flex-wrap gap-2">
                      {EXPERIENCES.map((exp) => (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => updateSportData(sport.name, 'experience', exp)}
                          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                            sport.experience === exp
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                              : 'border border-orange-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50'
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 목표 선택 */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-md ring-1 ring-emerald-200/50">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <div>
                <label className="text-base font-semibold text-gray-800">
                  현재 집중하고 있는 목표
                </label>
                <p className="text-xs text-gray-600">최대 2개까지 선택 가능</p>
              </div>
            </div>
            <p className="mb-4 text-xs text-gray-600">
              사용자의 목표 우선순위에 따라 CNS 점수가 낮을 때 제공되는 조언의 보수성 결정
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id)
                const isDisabled = !isSelected && selectedGoals.length >= 2
                const goalColors = [
                  'from-purple-500 to-pink-500',
                  'from-blue-500 to-cyan-500',
                  'from-orange-500 to-red-500',
                  'from-green-500 to-emerald-500',
                  'from-indigo-500 to-purple-500',
                  'from-yellow-500 to-orange-500',
                ]
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => handleGoalToggle(goal.id)}
                    disabled={isDisabled}
                    className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? `border-transparent bg-gradient-to-br ${goalColors[goal.id - 1]} text-white shadow-lg scale-105`
                        : isDisabled
                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        : 'border-emerald-200 bg-white text-gray-800 hover:border-emerald-400 hover:shadow-md hover:scale-[1.02]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-2 top-2 text-white">✓</div>
                    )}
                    <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {goal.title}
                    </div>
                    <div className={`mt-1 text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                      {goal.subtitle}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 피로도 선택 */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-md ring-1 ring-violet-200/50">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">😴</span>
              <div>
                <label className="text-base font-semibold text-gray-800">
                  평소 일상에서 느끼는 피로도
                </label>
              </div>
            </div>
            <p className="mb-4 text-xs text-gray-600">
              사용자의 개인별 기준점을 실시간으로 보정하기 위한 핵심 변수
            </p>

            <div className="flex flex-col gap-2.5">
              {FATIGUE_LEVELS.map((level, index) => {
                const fatigueColors = [
                  { bg: 'from-green-400 to-emerald-500', hoverBorder: 'hover:border-green-400' },
                  { bg: 'from-lime-400 to-green-500', hoverBorder: 'hover:border-lime-400' },
                  { bg: 'from-yellow-400 to-orange-500', hoverBorder: 'hover:border-yellow-400' },
                  { bg: 'from-orange-400 to-red-500', hoverBorder: 'hover:border-orange-400' },
                  { bg: 'from-red-500 to-rose-600', hoverBorder: 'hover:border-red-400' },
                ]
                const isSelected = lifestyleStress === level.value
                const color = fatigueColors[index]
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setLifestyleStress(level.value)}
                    className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? `border-transparent bg-gradient-to-r ${color.bg} text-white shadow-lg scale-105`
                        : `border-gray-200 bg-white text-gray-700 ${color.hoverBorder} hover:shadow-md hover:scale-[1.02]`
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">✓</div>
                    )}
                    <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {level.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>완료하기</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </button>
        </form>
      </div>
    </div>
  )
}
