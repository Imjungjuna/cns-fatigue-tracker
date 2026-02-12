'use client'

import { Button } from "@/components/ui/button"
import { signOut } from '@/app/(auth)/actions'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" size="sm">
        로그아웃
      </Button>
    </form>
  )
}
