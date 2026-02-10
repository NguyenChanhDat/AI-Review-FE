<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Stat {
  label: string
  value: number
  change: number
  icon: string
  color: string
}

const stats = ref<Stat[]>([
  {
    label: 'Total Reviews',
    value: 2847,
    change: 12.5,
    icon: '✓',
    color: 'green',
  },
  {
    label: 'Pending Reviews',
    value: 342,
    change: -5.2,
    icon: '⏱️',
    color: 'orange',
  },
  {
    label: 'Issues Found',
    value: 1263,
    change: 8.7,
    icon: '⚠️',
    color: 'red',
  },
  {
    label: 'Organizations',
    value: 8,
    change: 2.1,
    icon: '🏢',
    color: 'blue',
  },
])

interface RecentReview {
  id: string
  repo: string
  project: string
  organization: string
  status: 'pending' | 'completed' | 'needs-review'
  issues: number
  timestamp: string
}

const recentReviews = ref<RecentReview[]>([
  {
    id: '1',
    repo: 'api-service',
    project: 'Backend',
    organization: 'TechCorp',
    status: 'pending',
    issues: 5,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    repo: 'frontend-app',
    project: 'Mobile',
    organization: 'TechCorp',
    status: 'completed',
    issues: 2,
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    repo: 'data-processor',
    project: 'Analytics',
    organization: 'DataInc',
    status: 'needs-review',
    issues: 8,
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    repo: 'auth-service',
    project: 'Security',
    organization: 'SecureApp',
    status: 'completed',
    issues: 1,
    timestamp: '1 day ago',
  },
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-orange-950 text-orange-300',
    completed: 'bg-green-950 text-green-300',
    'needs-review': 'bg-red-950 text-red-300',
  }
  return colors[status] || 'bg-slate-700 text-slate-300'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'Pending',
    completed: 'Completed',
    'needs-review': 'Needs Review',
  }
  return texts[status] || status
}

const goToOrganizations = () => {
  router.push('/app/organizations')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Code Review Monitor</h1>
      <p class="text-slate-400">Welcome back! Here's your AI code review overview.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-2">{{ stat.label }}</p>
            <h2 class="text-3xl font-bold text-white mb-1">{{ stat.value }}</h2>
            <p
              :class="[
                'text-sm',
                stat.change > 0 ? 'text-green-400' : 'text-red-400',
              ]"
            >
              {{ stat.change > 0 ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%
              {{ stat.change > 0 ? 'increase' : 'decrease' }}
            </p>
          </div>
          <span class="text-4xl">{{ stat.icon }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Reviews Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div class="border-b border-slate-700 p-6 flex items-center justify-between">
            <span class="text-white font-semibold">Recent Reviews</span>
            <button
              @click="goToOrganizations"
              class="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th class="text-slate-300 font-semibold py-3 px-6 text-left">Repository</th>
                  <th class="text-slate-300 font-semibold py-3 px-6 text-left">Organization</th>
                  <th class="text-slate-300 font-semibold py-3 px-6 text-left">Status</th>
                  <th class="text-slate-300 font-semibold py-3 px-6 text-left">Issues</th>
                  <th class="text-slate-300 font-semibold py-3 px-6 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="review in recentReviews"
                  :key="review.id"
                  class="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                >
                  <td class="py-3 px-6 text-white font-medium">{{ review.repo }}</td>
                  <td class="py-3 px-6 text-slate-300">{{ review.organization }}</td>
                  <td class="py-3 px-6">
                    <span
                      :class="['px-3 py-1 rounded text-sm font-medium', getStatusColor(review.status)]"
                    >
                      {{ getStatusText(review.status) }}
                    </span>
                  </td>
                  <td class="py-3 px-6">
                    <span
                      :class="[
                        'font-semibold',
                        review.issues > 5 ? 'text-red-400' : 'text-orange-400',
                      ]"
                    >
                      {{ review.issues }}
                    </span>
                  </td>
                  <td class="py-3 px-6 text-slate-400 text-sm">{{ review.timestamp }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-4">
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 class="text-white font-semibold mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <button
              @click="goToOrganizations"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              ➕ New Review
            </button>
            <button
              @click="router.push('/app/settings')"
              class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              ⚙️ Configure Rules
            </button>
          </div>
        </div>

        <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 class="text-white font-semibold mb-4">System Status</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">API Status</span>
              <span class="text-green-400">✓</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">AI Model</span>
              <span class="text-green-400">✓</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Database</span>
              <span class="text-green-400">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
