<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const router = useRouter()
const route = useRoute()

interface PrReviewFileDto {
  id: string
  prId: number
  diffContent: string
  diffHash: string
  hasIssue: boolean
  reviewComment: string | null
  severity: string | null
  createdAt: string
  createdBy: string
  isAccepted: boolean
}

interface GetPrsByRepoResponse {
  count: number
  prs: PrReviewFileDto[]
}

const repoId = route.params.repoId as string
const organizationName = route.params.orgId as string
const projectId = route.params.projectId as string

const reviews = ref<PrReviewFileDto[]>([])
const isLoading = ref(false)

const fetchReviews = async () => {
  isLoading.value = true
  try {
    const response = await fetchWithAuth(
      `http://localhost:4000/api/organizations/${organizationName}/projects/${projectId}/repositories/${repoId}/prs`,
    )

    if (response.ok) {
      const data: GetPrsByRepoResponse = await response.json()
      reviews.value = data.prs
    } else {
      console.error('Failed to fetch reviews')
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchReviews()
})

// Derive status from hasIssue and isAccepted
const getStatus = (review: PrReviewFileDto): 'pending' | 'approved' | 'changes-requested' => {
  if (review.isAccepted) return 'approved'
  if (review.hasIssue) return 'changes-requested'
  return 'pending'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'changes-requested': 'bg-red-950 text-red-300',
    pending: 'bg-orange-950 text-orange-300',
    approved: 'bg-green-950 text-green-300',
  }
  return colors[status] || 'bg-slate-700 text-slate-300'
}

const getSeverityColor = (severity: string | null) => {
  if (!severity) return 'bg-slate-700 text-slate-300'
  const colors: Record<string, string> = {
    high: 'bg-red-950 text-red-300',
    medium: 'bg-orange-950 text-orange-300',
    low: 'bg-green-950 text-green-300',
  }
  return colors[severity.toLowerCase()] || 'bg-slate-700 text-slate-300'
}

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

const selectReview = (review: PrReviewFileDto) => {
  router.push(
    `/app/organizations/${organizationName}/projects/${projectId}/repos/${repoId}/reviews/${review.id}`,
  )
}

const goBack = () => {
  router.push(`/app/organizations/${organizationName}/projects/${projectId}/repos`)
}

const filterStatus = ref<string>('all')

const filteredReviews = computed(() => {
  if (filterStatus.value === 'all') return reviews.value
  return reviews.value.filter((r) => getStatus(r) === filterStatus.value)
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

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-slate-400">Loading reviews...</p>
    </div>

    <!-- Reviews List -->
    <div v-else-if="filteredReviews.length > 0" class="space-y-3">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        @click="selectReview(review)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- PR ID and Status -->
            <div class="flex items-center gap-3 mb-2">
              <span>📄</span>
              <h3 class="text-white font-bold text-lg">PR #{{ review.prId }}</h3>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getStatusColor(getStatus(review)),
                ]"
              >
                {{ getStatus(review).replace('-', ' ') }}
              </span>
            </div>

            <!-- Author and Time -->
            <div class="flex items-center gap-4 mb-3 text-sm">
              <div class="flex items-center gap-2">
                <span>👤</span>
                <span class="text-slate-300">{{ review.createdBy }}</span>
              </div>
              <span class="text-slate-400">{{ formatTimestamp(review.createdAt) }}</span>
            </div>

            <!-- Review Comment -->
            <p v-if="review.reviewComment" class="text-slate-400 text-sm mb-3 line-clamp-2">
              {{ review.reviewComment }}
            </p>
            <p v-else class="text-slate-500 text-sm mb-3 italic">No review comment</p>

            <!-- Issues and Severity -->
            <div class="flex items-center gap-4 text-sm">
              <span
                v-if="review.severity"
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getSeverityColor(review.severity),
                ]"
              >
                {{ review.severity }} severity
              </span>
              <span class="text-slate-300">
                <span v-if="review.hasIssue">⚠️ Has issues</span>
                <span v-else>✓ No issues</span>
              </span>
            </div>
          </div>

          <span class="text-slate-400 text-2xl ml-4">→</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <span class="text-4xl">🔍</span>
      <p class="text-slate-400 mt-4">
        No reviews found{{ filterStatus !== 'all' ? ' for the selected filter' : '' }}.
      </p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
