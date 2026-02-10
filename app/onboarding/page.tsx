import { completeOnboarding } from './actions'

// 디자인은 최소화하고, 데이터 구조가 보이도록 깔끔한 기본 폼만 구성
export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-xl font-semibold">온보딩 정보 입력</h1>

        <form action={completeOnboarding} className="space-y-6">
          {/* 닉네임 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">닉네임</label>
            <input
              name="nickname"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="예: 철인준"
              required
            />
          </div>

          {/* 목표 (최대 2개) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              현재 집중하고 있는 목표 (최대 2개)
            </label>
            <p className="text-xs text-gray-500">
              같은 name(&quot;goals&quot;)으로 최대 두 개까지 입력됩니다.
            </p>
            <input
              name="goals"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="예: 시합 피킹"
            />
            <input
              name="goals"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="예: 부상 방지"
            />
          </div>

          {/* 평소 일상 피로도 (1~5) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              평소 일상에서 느끼는 피로도 (1~5)
            </label>
            <input
              name="lifestyleStress"
              type="number"
              min={1}
              max={5}
              className="w-full max-w-[120px] rounded-md border px-3 py-2 text-sm"
              placeholder="1~5"
              required
            />
          </div>

          {/* 운동 종목들 (최대 3개) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              운동 종목 (최대 3개)
            </label>
            <p className="text-xs text-gray-500">
              각 종목별로 이름, 주간 횟수(숫자), 경력(텍스트)를 입력합니다.
            </p>

            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="rounded-md border px-3 py-3 text-sm space-y-2"
              >
                <div className="text-xs font-semibold text-gray-500">
                  종목 {idx}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    name={`sportName${idx}`}
                    type="text"
                    className="rounded-md border px-2 py-1"
                    placeholder="이름 (예: 주짓수)"
                  />
                  <input
                    name={`sportFrequency${idx}`}
                    type="number"
                    min={0}
                    className="rounded-md border px-2 py-1"
                    placeholder="주/횟수 (숫자)"
                  />
                  <input
                    name={`sportExperience${idx}`}
                    type="text"
                    className="rounded-md border px-2 py-1"
                    placeholder="경력 (예: 1~3년)"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black py-2 text-sm font-medium text-white"
          >
            온보딩 완료
          </button>
        </form>
      </div>
    </div>
  )
}
