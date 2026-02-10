<script setup lang="ts">
import { ref } from 'vue'

interface DateStat {
  date: string
  reviews: number
  issues: number
  approved: number
}

const dateStats = ref<DateStat[]>([
  { date: 'Mon', reviews: 45, issues: 23, approved: 22 },
  { date: 'Tue', reviews: 52, issues: 28, approved: 24 },
  { date: 'Wed', reviews: 38, issues: 18, approved: 20 },
  { date: 'Thu', reviews: 61, issues: 35, approved: 26 },
  { date: 'Fri', reviews: 55, issues: 31, approved: 24 },
  { date: 'Sat', reviews: 20, issues: 8, approved: 12 },
  { date: 'Sun', reviews: 15, issues: 5, approved: 10 },
])

const severityData = [
  { label: 'High', value: 187 },
  { label: 'Medium', value: 324 },
  { label: 'Low', value: 412 },
]

const topRepositories = ref([
  { name: 'api-gateway', reviews: 143, issues: 35, approved: 108 },
  { name: 'user-service', reviews: 127, issues: 42, approved: 85 },
  { name: 'auth-service', reviews: 98, issues: 18, approved: 80 },
  { name: 'payment-service', reviews: 76, issues: 15, approved: 61 },
  { name: 'analytics-service', reviews: 54, issues: 12, approved: 42 },
])

const selectedPeriod = ref('week')
const maxReviews = ref(Math.max(...dateStats.value.map((s) => s.reviews)))
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
      <p class="text-slate-400">Code review metrics and performance insights.</p>
    </div>

    <!-- Period Selector -->
    <div class="flex gap-2">
      <button
        v-for="period in ['week', 'month', 'quarter', 'year']"
        :key="period"
        @click="selectedPeriod = period"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
          selectedPeriod === period
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
        ]"
      >
        {{
          { week: 'This Week', month: 'This Month', quarter: 'This Quarter', year: 'This Year' }[
            period
          ]
        }}
      </button>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <p class="text-slate-400 text-sm font-medium mb-2">Total Reviews</p>
        <h2 class="text-3xl font-bold text-white mb-1">486</h2>
        <p class="text-green-400 text-sm">↑ +12% from last period</p>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <p class="text-slate-400 text-sm font-medium mb-2">Issues Found</p>
        <h2 class="text-3xl font-bold text-white mb-1">923</h2>
        <p class="text-orange-400 text-sm">⚠️ Avg 1.9 per review</p>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <p class="text-slate-400 text-sm font-medium mb-2">Approval Rate</p>
        <h2 class="text-3xl font-bold text-white mb-1">78%</h2>
        <p class="text-blue-400 text-sm">✓ 379 approved</p>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <p class="text-slate-400 text-sm font-medium mb-2">Avg Review Time</p>
        <h2 class="text-3xl font-bold text-white mb-1">2.3h</h2>
        <p class="text-green-400 text-sm">⏱️ -5% faster</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Daily Activity Chart -->
      <div class="lg:col-span-2">
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 class="text-white font-semibold mb-4">Review Activity</h2>
          <div class="space-y-4">
            <div v-for="stat in dateStats" :key="stat.date" class="flex items-center gap-4">
              <span class="w-12 text-slate-300 text-sm font-medium">{{ stat.date }}</span>
              <div class="flex-1 space-y-1">
                <div class="flex items-end gap-2 h-12">
                  <!-- Reviews bar -->
                  <div
                    class="bg-blue-600 rounded transition-all"
                    :style="{
                      height: `${(stat.reviews / maxReviews) * 100}%`,
                      minHeight: '4px',
                    }"
                    :title="`Reviews: ${stat.reviews}`"
                  ></div>
                  <!-- Issues bar -->
                  <div
                    class="bg-red-600 rounded transition-all"
                    :style="{
                      height: `${(stat.issues / maxReviews) * 100}%`,
                      minHeight: '4px',
                    }"
                    :title="`Issues: ${stat.issues}`"
                  ></div>
                  <!-- Approved bar -->
                  <div
                    class="bg-green-600 rounded transition-all"
                    :style="{
                      height: `${(stat.approved / maxReviews) * 100}%`,
                      minHeight: '4px',
                    }"
                    :title="`Approved: ${stat.approved}`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <!-- Legend -->
          <div class="flex gap-4 mt-6 pt-4 border-t border-slate-700 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-blue-600"></div>
              <span class="text-slate-300">Reviews</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-red-600"></div>
              <span class="text-slate-300">Issues</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-green-600"></div>
              <span class="text-slate-300">Approved</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Severity Distribution -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 class="text-white font-semibold mb-4">Issues by Severity</h2>
        <div class="space-y-3">
          <div
            v-for="item in severityData"
            :key="item.label"
            class="flex items-center justify-between"
          >
            <span class="text-slate-300">{{ item.label }}</span>
            <div class="flex items-center gap-2">
              <div
                class="h-2 rounded transition-all"
                :class="
                  item.label === 'High'
                    ? 'bg-red-600 w-24'
                    : item.label === 'Medium'
                      ? 'bg-orange-600 w-32'
                      : 'bg-green-600 w-40'
                "
              ></div>
              <span class="text-white font-semibold w-12 text-right">{{ item.value }}</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-700 text-sm text-slate-400">
            Total: {{ severityData.reduce((a, b) => a + b.value, 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Top Repositories -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div class="p-6 border-b border-slate-700">
        <h2 class="text-white font-semibold">Top Repositories</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-900 border-b border-slate-700">
            <tr>
              <th class="text-slate-300 font-semibold py-3 px-6 text-left">Repository</th>
              <th class="text-slate-300 font-semibold py-3 px-6 text-center">Reviews</th>
              <th class="text-slate-300 font-semibold py-3 px-6 text-center">Issues</th>
              <th class="text-slate-300 font-semibold py-3 px-6 text-center">Approved</th>
              <th class="text-slate-300 font-semibold py-3 px-6 text-right">Approval %</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="repo in topRepositories"
              :key="repo.name"
              class="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
            >
              <td class="py-3 px-6 text-white font-medium">{{ repo.name }}</td>
              <td class="py-3 px-6 text-center text-slate-300">{{ repo.reviews }}</td>
              <td class="py-3 px-6 text-center">
                <span class="text-red-400 font-semibold">{{ repo.issues }}</span>
              </td>
              <td class="py-3 px-6 text-center">
                <span class="text-green-400 font-semibold">{{ repo.approved }}</span>
              </td>
              <td class="py-3 px-6 text-right text-slate-300">
                {{ Math.round((repo.approved / repo.reviews) * 100) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
