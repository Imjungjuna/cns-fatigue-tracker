import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl">
              👤
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">내 계정</CardTitle>
          <CardDescription>
            로그인된 계정 정보를 확인할 수 있어요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>이메일</Label>
            <Input
              value={email}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label>비밀번호</Label>
            <Input
              value="•••••••••"
              disabled
              className="bg-muted"
            />
            <CardDescription className="text-xs">
              보안상 표시되지 않습니다
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

