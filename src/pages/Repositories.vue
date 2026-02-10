<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface Repository {
  id: string
  name: string
  description: string
  reviews: number
  issues: number
  lastReview: string
  language: string
}

const orgId = route.params.orgId as string
const projectId = route.params.projectId as string

const breadcrumbName = computed(() => {
  const projectMap: Record<string, string> = {
    '1': 'Backend Services',
    '2': 'Frontend Applications',
    '3': 'Data Pipeline',
  }
  return projectMap[projectId] || 'Project'
})

const repositories = ref<Repository[]>([
  {
    id: '1',
    name: 'api-gateway',
    description: 'Main API gateway for service routing',
    reviews: 143,
    issues: 5,
    lastReview: '1 hour ago',
    language: 'Go',
  },
  {
    id: '2',
    name: 'auth-service',
    description: 'Authentication and authorization service',
    reviews: 98,
    issues: 2,
    lastReview: '3 hours ago',
    language: 'Node.js',
  },
  {
    id: '3',
    name: 'user-service',
    description: 'User management and profile service',
    reviews: 127,
    issues: 8,
    lastReview: '30 mins ago',
    language: 'Python',
  },
  {
    id: '4',
    name: 'payment-service',
    description: 'Payment processing and billing',
    reviews: 76,
    issues: 3,
    lastReview: '2 days ago',
    language: 'Java',
  },
  {
    id: '5',
    name: 'notification-service',
    description: 'Email and push notifications',
    reviews: 62,
    issues: 1,
    lastReview: '5 days ago',
    language: 'Go',
  },
  {
    id: '6',
    name: 'analytics-service',
    description: 'Event tracking and analytics',
    reviews: 54,
    issues: 4,
    lastReview: '1 week ago',
    language: 'Scala',
  },
  {
    id: '7',
    name: 'cache-layer',
    description: 'Redis caching and session management',
    reviews: 89,
    issues: 0,
    lastReview: '4 days ago',
    language: 'Rust',
  },
  {
    id: '8',
    name: 'database-migration',
    description: 'Database schema and migrations',
    reviews: 45,
    issues: 6,
    lastReview: '2 hours ago',
    language: 'SQL',
  },
])

const selectRepository = (repo: Repository) => {
  router.push(
    `/app/organizations/${orgId}/projects/${projectId}/repos/${repo.id}/reviews`
  )
}

const goBack = () => {
  router.push(`/app/organizations/${orgId}/projects`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-3 mb-4">
      <button
        @click="goBack"
        class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
      >
        ←
      </button>
      <h1 class="text-3xl font-bold text-white">{{ breadcrumbName }}</h1>
    </div>

    <div>
      <h2 class="text-xl text-slate-300 font-semibold mb-1">Repositories</h2>
      <p class="text-slate-400">Select a repository to view AI code reviews.</p>
    </div>

    <!-- Repositories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="repo in repositories"
        :key="repo.id"
        @click="selectRepository(repo)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-white font-bold text-lg mb-1">{{ repo.name }}</h3>
            <span class="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-900 text-blue-300">
              {{ repo.language }}
            </span>
          </div>
          <span class="text-slate-400 text-2xl">📦</span>
        </div>

        <!-- Description -->
        <p class="text-slate-400 text-sm mb-4 line-clamp-2">{{ repo.description }}</p>

        <!-- Stats -->
        <div class="space-y-2 mb-4 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Code Reviews:</span>
            <span class="text-white font-semibold">{{ repo.reviews }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Issues Found:</span>
            <span
              :class="[
                'font-semibold',
                repo.issues > 5 ? 'text-red-400' : repo.issues > 0 ? 'text-orange-400' : 'text-green-400',
              ]"
            >
              {{ repo.issues }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Last Review:</span>
            <span class="text-slate-300">{{ repo.lastReview }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-sm">
          View Reviews →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
