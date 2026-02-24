<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const router = useRouter()
const route = useRoute()

interface RepositoryDto {
  id: string
  name: string
  url: string
  sshUrl: string
}

interface GetRepositoriesByProjectResponse {
  count: number
  repositories: RepositoryDto[]
}

const organizationName = route.params.orgId as string
const projectId = route.params.projectId as string
const projectName = (route.query.projectName as string) || ''

const repositories = ref<RepositoryDto[]>([])
const isLoading = ref(false)

const fetchRepositories = async () => {
  isLoading.value = true
  try {
    const response = await fetchWithAuth(
      `http://localhost:4000/api/organizations/${organizationName}/projects/${projectId}/repositories`,
    )

    if (response.ok) {
      const data: GetRepositoriesByProjectResponse = await response.json()
      repositories.value = data.repositories
    } else {
      console.error('Failed to fetch repositories')
    }
  } catch (error) {
    console.error('Error fetching repositories:', error)
  } finally {
    isLoading.value = false
  }
}

// Construct Azure DevOps HTTPS URL
const getHttpsUrl = (repoName: string): string => {
  return `https://dev.azure.com/${organizationName}/${projectName}/_git/${repoName}`
}

onMounted(() => {
  fetchRepositories()
})

const selectRepository = (repo: RepositoryDto) => {
  router.push(
    `/app/organizations/${organizationName}/projects/${projectId}/repos/${repo.id}/reviews`,
  )
}

const goBack = () => {
  router.push(`/app/organizations/${organizationName}/projects`)
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
      <h1 class="text-3xl font-bold text-white">Repositories</h1>
    </div>

    <div>
      <h2 class="text-xl text-slate-300 font-semibold mb-1">Project Repositories</h2>
      <p class="text-slate-400">Select a repository to view AI code reviews.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-slate-400">Loading repositories...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="repositories.length === 0" class="text-center py-12">
      <p class="text-slate-400">No repositories found</p>
    </div>

    <!-- Repositories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="repo in repositories"
        :key="repo.id"
        @click="selectRepository(repo)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-white font-bold text-lg mb-2">{{ repo.name }}</h3>
          </div>
          <span class="text-slate-400 text-2xl">📦</span>
        </div>

        <!-- Repository Links -->
        <div class="space-y-2 mb-4">
          <div>
            <span class="text-slate-400 text-xs">HTTPS URL:</span>
            <a
              :href="getHttpsUrl(repo.name)"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
              class="text-blue-400 hover:text-blue-300 text-sm block break-all hover:underline mt-1"
            >
              {{ getHttpsUrl(repo.name) }}
            </a>
          </div>
          <div>
            <span class="text-slate-400 text-xs">SSH URL:</span>
            <code class="text-slate-300 text-xs block break-all mt-1 bg-slate-900 p-2 rounded">
              {{ repo.sshUrl }}
            </code>
          </div>
        </div>

        <!-- Action Button -->
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
        >
          View Reviews →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
