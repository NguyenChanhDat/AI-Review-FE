<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleMicrosoft = () => {
  router.push('/onboarding/repo-provider')
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
    <div class="w-full max-w-md px-6">
      <!-- Logo -->
      <div class="mb-12 text-center">
        <div class="mb-4 text-5xl">🔍</div>
        <h1 class="text-3xl font-bold text-white">Code Review Monitor</h1>
        <p class="mt-2 text-slate-400">AI-powered code review system</p>
      </div>

      <!-- Card -->
      <div class="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-xl">
        <h2 class="mb-2 text-2xl font-bold text-white">Choose Your Provider</h2>
        <p class="mb-8 text-slate-400">Select your authentication method to get started</p>

        <!-- Microsoft Option -->
        <button
          @click="handleMicrosoft"
          class="mb-4 w-full rounded-lg border-2 border-slate-600 bg-slate-700 px-6 py-4 font-semibold text-white transition-all hover:border-blue-500 hover:bg-slate-600"
        >
          <div class="flex items-center justify-center gap-3">
            <span class="text-2xl">🔷</span>
            <div>
              <div>Microsoft</div>
              <div class="text-sm font-normal text-slate-400">Azure AD Authentication</div>
            </div>
          </div>
        </button>

        <!-- Google+ Option (Disabled) -->
        <div class="rounded-lg border-2 border-slate-700 bg-slate-800 px-6 py-4 opacity-50">
          <div class="flex items-center justify-center gap-3 text-slate-500">
            <span class="text-2xl">📱</span>
            <div>
              <div>Google+</div>
              <div class="text-sm font-normal text-slate-600">Coming soon</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-sm text-slate-500">
        This is a demo application. No real OAuth connection required.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
