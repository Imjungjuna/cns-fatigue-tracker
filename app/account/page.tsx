import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const email = user?.email ?? '알 수 없음'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200/70">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl">
            👤
          </div>
          <h1 className="text-2xl font-bold text-gray-900">내 계정</h1>
          <p className="text-sm text-gray-500">
            로그인된 계정 정보를 확인할 수 있어요.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              이메일
            </label>
            <div className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
              {email}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              비밀번호
            </label>
            <div className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400">
              ••••••••• (보안상 표시되지 않습니다)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

