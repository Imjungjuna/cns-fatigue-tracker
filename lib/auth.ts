/** 로그인 후 리다이렉트 경로 (온보딩 완료 여부). signInWithGoogle → /auth/callback에서 사용 */
export function getPostLoginRedirectPath(
  profile: { onboarding_completed?: boolean } | null,
  profileError?: unknown
): string {
  if (profileError || !profile) return '/onboarding'
  return profile.onboarding_completed ? '/dashboard' : '/onboarding'
}
