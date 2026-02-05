<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface CodeReview {
  id: string
  file: string
  author: string
  timestamp: string
  status: 'pending' | 'approved' | 'changes-requested'
  severity: 'high' | 'medium' | 'low'
  issues: number
  preview: string
}

const repoId = route.params.repoId as string
const orgId = route.params.orgId as string
const projectId = route.params.projectId as string

const reviews = ref<CodeReview[]>([
  {
    id: '1',
    file: 'src/services/auth.ts',
    author: 'John Doe',
    timestamp: '2 hours ago',
    status: 'changes-requested',
    severity: 'high',
    issues: 3,
    preview:
      'Security vulnerability found in password validation logic. Missing input sanitization.',
  },
  {
    id: '2',
    file: 'src/components/UserForm.vue',
    author: 'Jane Smith',
    timestamp: '4 hours ago',
    status: 'pending',
    severity: 'medium',
    issues: 2,
    preview:
      'Performance issue: Component re-renders on every parent update. Consider memoization.',
  },
  {
    id: '3',
    file: 'src/utils/helpers.ts',
    author: 'Bob Johnson',
    timestamp: '1 day ago',
    status: 'approved',
    severity: 'low',
    issues: 1,
    preview: 'Code quality: Function should have JSDoc comments for clarity.',
  },
  {
    id: '4',
    file: 'src/api/endpoints.ts',
    author: 'Alice Williams',
    timestamp: '2 days ago',
    status: 'changes-requested',
    severity: 'high',
    issues: 4,
    preview: 'SQL Injection vulnerability detected in query builder. Requires immediate fix.',
  },
  {
    id: '5',
    file: 'src/styles/theme.css',
    author: 'Charlie Brown',
    timestamp: '3 days ago',
    status: 'approved',
    severity: 'low',
    issues: 0,
    preview: 'CSS is well-organized and follows BEM methodology.',
  },
  {
    id: '6',
    file: 'src/store/modules/user.ts',
    author: 'Diana Prince',
    timestamp: '5 days ago',
    status: 'pending',
    severity: 'medium',
    issues: 2,
    preview: 'State mutation outside of reducer detected. Use proper action methods.',
  },
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'changes-requested': 'bg-red-950 text-red-300',
    pending: 'bg-orange-950 text-orange-300',
    approved: 'bg-green-950 text-green-300',
  }
  return colors[status] || 'bg-slate-700 text-slate-300'
}

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    high: 'bg-red-950 text-red-300',
    medium: 'bg-orange-950 text-orange-300',
    low: 'bg-green-950 text-green-300',
  }
  return colors[severity] || 'bg-slate-700 text-slate-300'
}

const selectReview = (review: CodeReview) => {
  router.push(
    `/organizations/${orgId}/projects/${projectId}/repos/${repoId}/reviews/${review.id}`
  )
}

const goBack = () => {
  router.push(`/organizations/${orgId}/projects/${projectId}/repos`)
}

const filterStatus = ref<string>('all')

const filteredReviews = computed(() => {
  if (filterStatus.value === 'all') return reviews.value
  return reviews.value.filter((r) => r.status === filterStatus.value)
})
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
      <h1 class="text-3xl font-bold text-white">Code Reviews</h1>
    </div>

    <!-- Filters -->
    <div class="flex gap-3">
      <button
        v-for="status in ['all', 'pending', 'changes-requested', 'approved']"
        :key="status"
        @click="filterStatus = status"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
          filterStatus === status
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
        ]"
      >
        {{ status === 'all' ? 'All Reviews' : status.charAt(0).toUpperCase() + status.slice(1) }}
      </button>
    </div>

    <!-- Reviews List -->
    <div class="space-y-3">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        @click="selectReview(review)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- File and Status -->
            <div class="flex items-center gap-3 mb-2">
              <span>📄</span>
              <h3 class="text-white font-bold text-lg">{{ review.file }}</h3>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusColor(review.status)]">
                {{ review.status.replace('-', ' ') }}
              </span>
            </div>

            <!-- Author and Time -->
            <div class="flex items-center gap-4 mb-3 text-sm">
              <div class="flex items-center gap-2">
                <span>👤</span>
                <span class="text-slate-300">{{ review.author }}</span>
              </div>
              <span class="text-slate-400">{{ review.timestamp }}</span>
            </div>

            <!-- Preview -->
            <p class="text-slate-400 text-sm mb-3 line-clamp-2">{{ review.preview }}</p>

            <!-- Issues and Severity -->
            <div class="flex items-center gap-4 text-sm">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getSeverityColor(review.severity)]">
                {{ review.severity }} severity
              </span>
              <span class="text-slate-300">
                ⚠️ {{ review.issues }} issue{{ review.issues !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <span class="text-slate-400 text-2xl ml-4">→</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredReviews.length === 0" class="text-center py-12">
      <span class="text-4xl">🔍</span>
      <p class="text-slate-400 mt-4">No reviews found for the selected filter.</p>
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
