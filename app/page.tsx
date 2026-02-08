import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 로그인된 사용자는 대시보드로 리다이렉트 (대시보드가 있으면)
  // if (user) {
  //   redirect('/dashboard')
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shadow-lg">
              <span className="text-5xl">🧠</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
            CNS 피로도 추적기
          </h1>
          <p className="mb-4 text-xl text-gray-700 sm:text-2xl">
            중추신경계 피로도를 정밀하게 측정하고 관리하세요
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
            운동 종목별 부하 특성, 빈도, 적응도를 통합 분석하여 개인별 기저 피로도와 회복 탄력성을 정밀하게 산출합니다.
            최적의 훈련 타이밍을 찾아 성과를 극대화하세요.
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>시작하기</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link
              href="/login"
              className="w-full rounded-xl border-2 border-indigo-300 bg-white px-8 py-4 font-semibold text-indigo-600 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md sm:w-auto"
            >
              로그인
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-24 max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
            주요 기능
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200/50 transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">정밀 피로도 측정</h3>
              <p className="text-gray-600">
                종목별 부하 특성, 빈도, 적응도를 통합하여 개인별 기저 피로도 및 회복 탄력성을 정밀 산출
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200/50 transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">맞춤형 조언</h3>
              <p className="text-gray-600">
                목표 우선순위에 따라 CNS 점수가 낮을 때 제공되는 조언의 보수성을 자동 조절
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200/50 transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">실시간 보정</h3>
              <p className="text-gray-600">
                평소 일상에서 느끼는 피로도를 기반으로 개인별 기준점을 실시간으로 보정
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200/50 transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="mb-4 text-4xl">💪</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">다양한 운동 종목</h3>
              <p className="text-gray-600">
                MMA, 복싱, 주짓수, 레슬링, 보디빌딩, 파워리프팅 등 다양한 운동 종목 지원
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200/50 transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="mb-4 text-4xl">📈</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">성과 최적화</h3>
              <p className="text-gray-600">
                최적의 훈련 타이밍을 찾아 성과를 극대화하고 부상 위험을 최소화
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200/50 transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="mb-4 text-4xl">🔄</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">회복 관리</h3>
              <p className="text-gray-600">
                부상 방지 및 회복 관리를 위한 체계적인 피로도 모니터링
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
            작동 방식
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 p-6 shadow-md ring-1 ring-orange-200/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">프로필 설정</h3>
                <p className="text-gray-600">
                  닉네임, 주로 하는 운동 종목과 주간 횟수, 경력, 목표, 일상 피로도를 입력하여 개인화된 프로필을 만듭니다.
                </p>
              </div>
            </div>

            <div className="flex gap-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-md ring-1 ring-emerald-200/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">피로도 추적</h3>
                <p className="text-gray-600">
                  매일의 운동과 일상 활동을 기록하고, 중추신경계 피로도를 실시간으로 측정합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 p-6 shadow-md ring-1 ring-violet-200/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">맞춤형 조언</h3>
                <p className="text-gray-600">
                  개인별 데이터를 분석하여 최적의 훈련 타이밍과 회복 전략을 제안합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold text-white">
              지금 시작하세요
            </h2>
            <p className="mb-8 text-lg text-indigo-100">
              정밀한 피로도 추적으로 최적의 성과를 달성하세요
            </p>
            <Link
              href="/signup"
              className="inline-block rounded-xl bg-white px-8 py-4 font-semibold text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:shadow-lg hover:scale-105"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
