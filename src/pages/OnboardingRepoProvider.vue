<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const router = useRouter()
const isLoading = ref(false)

interface SessionUserDto {
  userId: string
  displayName: string
  hasPat: boolean
}

const handleAzureDevOps = async () => {
  isLoading.value = true
  console.log('OnboardingRepoProvider: Azure DevOps clicked, checking session...')

  try {
    // Check session when user clicks Azure DevOps
    const response = await fetchWithAuth('http://localhost:4000/api/auth/session')
    console.log('OnboardingRepoProvider: Session check status:', response.status)

    if (response.ok) {
      const session: SessionUserDto = await response.json()
      console.log('OnboardingRepoProvider: Session data:', session)

      if (session.hasPat) {
        console.log('OnboardingRepoProvider: User has PAT, redirecting to dashboard')
        router.push('/app/dashboard')
      } else {
        console.log('OnboardingRepoProvider: User needs to provide PAT, going to PAT page')
        router.push('/onboarding/pat')
      }
    } else if (response.status === 401) {
      console.log('OnboardingRepoProvider: Not authenticated, redirecting to auth')
      router.push('/onboarding/auth')
    }
  } catch (error) {
    console.error('OnboardingRepoProvider: Error checking session:', error)
    isLoading.value = false
  }
}

const handleBack = () => {
  router.push('/onboarding/auth')
}
</script>

<template>
  <div
    class="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
  >
    <div class="w-full max-w-md px-6">
      <!-- Header with Back Button -->
      <div class="mb-8 flex items-center">
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
        >
          <span>←</span>
          <span>Back</span>
        </button>
      </div>

      <!-- Logo -->
      <div class="mb-12 text-center">
        <div class="mb-4 text-5xl">📦</div>
        <h1 class="text-3xl font-bold text-white">Select Repository Provider</h1>
        <p class="mt-2 text-slate-400">Choose where your code is hosted</p>
      </div>

      <!-- Card -->
      <div class="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-xl">
        <!-- Azure DevOps Option -->
        <button
          @click="handleAzureDevOps"
          :disabled="isLoading"
          class="mb-4 w-full rounded-lg border-2 border-slate-600 bg-slate-700 px-6 py-4 font-semibold text-white transition-all hover:border-blue-500 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="flex items-center justify-center gap-3">
            <span class="text-2xl">🔵</span>
            <div>
              <div>{{ isLoading ? 'Processing...' : 'Azure DevOps' }}</div>
              <div class="text-sm font-normal text-slate-400">Microsoft Azure Repos</div>
            </div>
          </div>
        </button>

        <!-- GitHub Option (Disabled) -->
        <div class="mb-4 rounded-lg border-2 border-slate-700 bg-slate-800 px-6 py-4 opacity-50">
          <div class="flex items-center justify-center gap-3 text-slate-500">
            <span class="text-2xl">⚫</span>
            <div>
              <div>GitHub</div>
              <div class="text-sm font-normal text-slate-600">Coming soon</div>
            </div>
          </div>
        </div>

        <!-- GitLab Option (Disabled) -->
        <div class="rounded-lg border-2 border-slate-700 bg-slate-800 px-6 py-4 opacity-50">
          <div class="flex items-center justify-center gap-3 text-slate-500">
            <span class="text-2xl">🟠</span>
            <div>
              <div>GitLab</div>
              <div class="text-sm font-normal text-slate-600">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
