<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const router = useRouter()

interface SessionUserDto {
  userId: string
  displayName: string
  hasPat: boolean
}

onMounted(async () => {
  try {
    console.log('OnboardingCallback: Checking session after OAuth...')
    // Check session after OAuth callback
    const response = await fetchWithAuth('http://localhost:4000/api/auth/session')
    console.log('OnboardingCallback: Session response status:', response.status)

    if (response.ok) {
      const session: SessionUserDto = await response.json()
      console.log('OnboardingCallback: Session data:', session)

      if (session.hasPat) {
        console.log('OnboardingCallback: User has PAT, redirecting to dashboard')
        // User has PAT, skip onboarding and go directly to dashboard
        router.push('/app/dashboard')
      } else {
        console.log('OnboardingCallback: User does not have PAT, redirecting to repo provider')
        // User needs to provide PAT, go to repo provider selection
        router.push('/onboarding/repo-provider')
      }
    } else {
      console.error('OnboardingCallback: Failed to fetch session, status:', response.status)
      // Something went wrong, redirect to auth
      router.push('/onboarding/auth')
    }
  } catch (error) {
    console.error('OnboardingCallback: Error during OAuth callback:', error)
    router.push('/onboarding/auth')
  }
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-blue-600 mb-4">Processing Login...</h1>
      <p class="text-gray-600">Please wait while we complete your authentication.</p>
    </div>
  </div>
</template>

<style scoped></style>
