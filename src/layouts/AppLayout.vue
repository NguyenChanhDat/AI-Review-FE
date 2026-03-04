<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const router = useRouter()
const route = useRoute()

interface SessionUserDto {
  userId: string
  displayName: string
  hasPat: boolean
}

interface NavItem {
  title: string
  icon: string
  path: string
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: '🏠',
    path: '/app/dashboard',
  },
  {
    title: 'Reviews',
    icon: '✓',
    path: '/app/organizations',
  },
  {
    title: 'Analytics',
    icon: '📊',
    path: '/app/analytics',
  },
  {
    title: 'RAG Knowledge Base',
    icon: '🧠',
    path: '/app/rag-knowledge-base',
  },
  {
    title: 'Setting',
    icon: '⚙️',
    path: '/app/setting',
  },
]

const user = ref<SessionUserDto | null>(null)

const isActive = (path: string) => {
  if (path === '/app/dashboard') return route.path.includes('dashboard') || route.path === '/app'
  if (path === '/app/organizations') return route.path.includes('organizations')
  return route.path.startsWith(path)
}

const navigate = (path: string) => {
  router.push(path)
}

const loadUserSession = async () => {
  try {
    console.log('AppLayout: Loading user session...')
    const response = await fetchWithAuth('http://localhost:4000/api/auth/session')
    if (response.ok) {
      user.value = await response.json()
      console.log('AppLayout: User session loaded:', user.value)
    }
  } catch (error) {
    console.error('Error loading user session:', error)
  }
}

const handleLogout = async () => {
  try {
    await fetchWithAuth('http://localhost:4000/api/auth/logout', {
      method: 'POST',
    })
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    router.push('/onboarding/auth')
  }
}

onMounted(() => {
  loadUserSession()
})
</script>

<template>
  <div class="flex h-screen bg-slate-950">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span class="text-white font-bold text-lg">CR</span>
          </div>
          <div>
            <h1 class="text-white font-bold text-sm">CodeReview</h1>
            <p class="text-slate-400 text-xs">AI Monitor</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-2 px-3">
          <li v-for="item in navItems" :key="item.path">
            <button
              @click="navigate(item.path)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200',
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800',
              ]"
            >
              <span class="text-lg">{{ item.icon }}</span>
              <span>{{ item.title }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- User Profile -->
      <div class="border-t border-slate-800 p-4">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors group"
          title="Click to logout"
        >
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"
          ></div>
          <div class="flex-1 min-w-0 text-left">
            <p class="text-white text-sm font-medium truncate">
              {{ user?.displayName || 'Developer' }}
            </p>
            <p class="text-slate-400 text-xs truncate">Logout</p>
          </div>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-slate-950">
      <!-- Header -->
      <header
        class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between"
      >
        <h1 class="text-white text-lg font-semibold">Code Review Monitor</h1>
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-white text-xl">
            🔔
          </button>
          <button class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-white text-xl">
            🔍
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Smooth scrolling */
main {
  scrollbar-width: thin;
  scrollbar-color: rgb(51, 65, 85) rgb(15, 23, 42);
}

main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: rgb(15, 23, 42);
}

main::-webkit-scrollbar-thumb {
  background: rgb(51, 65, 85);
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: rgb(71, 85, 105);
}
</style>
