<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface ProjectDto {
  accountId: string
  accountUri: string
  accountName: string
}

interface GetProjectsResponse {
  count: number
  projects: ProjectDto[]
}

const organizations = ref<ProjectDto[]>([])
const isLoading = ref(false)
const organizationCount = ref(0)

const fetchOrganizations = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:4000/api/project', {
      credentials: 'include',
    })

    if (response.ok) {
      const data: GetProjectsResponse = await response.json()
      organizations.value = data.projects
      organizationCount.value = data.count
    } else {
      console.error('Failed to fetch organizations')
    }
  } catch (error) {
    console.error('Error fetching organizations:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrganizations()
})

const selectOrganization = (org: ProjectDto) => {
  router.push(`/app/organizations/${org.accountId}/projects`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Organizations</h1>
      <p class="text-slate-400">Select an organization to view projects and code reviews.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-slate-400">Loading organizations...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="organizations.length === 0" class="text-center py-12">
      <p class="text-slate-400">No organizations found</p>
    </div>

    <!-- Organization Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="org in organizations"
        :key="org.accountId"
        @click="selectOrganization(org)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-center gap-4 mb-4">
          <span class="text-5xl">🏢</span>
          <h2 class="text-white font-bold text-lg">{{ org.accountName }}</h2>
        </div>

        <p class="text-slate-300 text-sm mb-4 break-all">
          <span class="text-slate-500">ID:</span> {{ org.accountId }}
        </p>

        <a
          :href="org.accountUri"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-400 hover:text-blue-300 text-sm mb-4 block break-all hover:underline"
        >
          {{ org.accountUri }}
        </a>

        <button class="w-full text-blue-400 hover:text-blue-300 text-sm font-medium">
          Select →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
