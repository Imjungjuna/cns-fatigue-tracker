'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

/** OAuth 콜백용 절대 URL. 배포(Vercel)에서는 NEXT_PUBLIC_SITE_URL 또는 VERCEL_URL 사용 */
function getAuthCallbackBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  return 'http://localhost:3000'
}

// --- 당분간 Google OAuth만 사용. 이메일/비밀번호 로그인·회원가입은 주석 처리 ---
// export async function login(formData: FormData) {
//   const supabase = await createClient()
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }
//   const { error } = await supabase.auth.signInWithPassword(data)
//   if (error) redirect('/error')
//   const { data: { user } } = await supabase.auth.getUser()
//   if (user) {
//     const { data: profile } = await supabase
//       .from('profiles')
//       .select('onboarding_completed')
//       .eq('id', user.id)
//       .maybeSingle()
//     revalidatePath('/', 'layout')
//     const redirectTo = profile?.onboarding_completed ? '/dashboard' : '/onboarding'
//     redirect(redirectTo)
//   }
//   revalidatePath('/', 'layout')
//   redirect('/onboarding')
// }

// export async function signup(formData: FormData) {
//   const supabase = await createClient()
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }
//   const { data: signUpData, error } = await supabase.auth.signUp({
//     email: data.email,
//     password: data.password,
//     options: { emailRedirectTo: `${getAuthCallbackBaseUrl()}/auth/callback` },
//   })
//   if (error) {
//     console.log('Signup error:', error)
//     redirect(`/error`)
//   }
//   redirect(`/signup/emailsent`)
// }

/** Google 로그인. 콜백(/auth/callback)에서 getPostLoginRedirectPath 로 온보딩/대시보드 분기 */
export async function signInWithGoogle() {
  const supabase = await createClient()
  const baseUrl = getAuthCallbackBaseUrl()
  const redirectTo = `${baseUrl}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectTo },
  })

  if (error) {
    console.error('Google OAuth error:', error)
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// export async function resendConfirmationEmail(formData: FormData) {
//   const supabase = await createClient()
//   const email = formData.get('email') as string
//   const { error } = await supabase.auth.resend({
//     type: 'signup',
//     email: email,
//   })
//   if (error) {
//     console.error('Resend email error:', error)
//     return { error: error.message }
//   }
//   return { success: true }
// }