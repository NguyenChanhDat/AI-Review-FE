<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const pat = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleBack = () => {
  router.push('/onboarding/repo-provider')
}

const handleConnect = async () => {
  if (!pat.value.trim()) {
    alert('Please enter a Personal Access Token')
    return
  }

  isLoading.value = true
  try {
    const response = await fetch('http://localhost:4000/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        personalAccessToken: pat.value,
      }),
    })

    if (response.ok) {
      router.push('/app/dashboard')
    } else {
      alert('Failed to connect. Please check your PAT.')
    }
  } catch (error) {
    alert('Error connecting to server')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleConnect()
  }
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
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
        <div class="mb-4 text-5xl">🔐</div>
        <h1 class="text-3xl font-bold text-white">Personal Access Token</h1>
        <p class="mt-2 text-slate-400">Enter your Azure DevOps PAT</p>
      </div>

      <!-- Card -->
      <div class="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-xl">
        <div class="mb-6">
          <label class="mb-3 block text-sm font-semibold text-white">
            PAT (Personal Access Token)
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="pat"
              placeholder="Enter your Azure DevOps PAT..."
              @keydown="handleKeyDown"
              class="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              @click="showPassword = !showPassword"
              type="button"
              class="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <p class="mt-2 text-xs text-slate-500">
            Your token is used only for this session and not stored.
          </p>
        </div>

        <!-- Info Box -->
        <div class="mb-6 rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3">
          <p class="text-sm text-slate-300">
            <span class="font-semibold">💡 Tip:</span> You can create a PAT in your Azure DevOps settings under Personal access tokens.
          </p>
        </div>

        <!-- Connect Button -->
        <button
          @click="handleConnect"
          :disabled="isLoading"
          class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Connecting...' : 'Connect to Azure DevOps' }}
        </button>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-sm text-slate-500">
        This is a demo. No real connection will be made.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
