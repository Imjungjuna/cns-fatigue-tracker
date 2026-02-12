'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  // 프로필 확인 후 온보딩 또는 대시보드로 리다이렉트
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    revalidatePath('/', 'layout')
    const redirectTo = profile ? '/dashboard' : '/onboarding'
    redirect(redirectTo)
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })
  
  if (error) {
    console.log('Signup error:', error);
    // 에러를 쿼리 파라미터로 전달하여 디버깅 가능하도록
    redirect(`/error`);
  }
  
  // Supabase는 이메일 확인이 필요한 경우에도 에러를 반환하지 않을 수 있음
  // 이 경우 user가 null이거나 email이 확인되지 않은 상태일 수 있음
  // 하지만 이메일은 전송되었으므로 emailsent 페이지로 리다이렉트
  redirect(`/signup/emailsent`)
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
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

export async function resendConfirmationEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })
  
  if (error) {
    console.error('Resend email error:', error)
    return { error: error.message }
  }
  
  return { success: true }
}