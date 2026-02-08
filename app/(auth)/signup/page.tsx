import { signup } from '../actions'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border p-6 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">회원가입</h2>
          <p className="text-sm text-gray-500">계정을 생성하고 피로도 관리를 시작해</p>
        </div>
        <form action={signup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">이메일</label>
            <input name="email" type="email" required className="w-full rounded-md border p-2" placeholder="example@test.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">비밀번호</label>
            <input name="password" type="password" required className="w-full rounded-md border p-2" placeholder="********" />
          </div>
          <button type="submit" className="w-full rounded-md bg-black p-2 text-white hover:bg-gray-800">
            다음 단계로
          </button>
        </form>
      </div>
    </div>
  )
}