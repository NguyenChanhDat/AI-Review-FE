<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const router = useRouter()
const route = useRoute()

interface ProjectDto {
  id: string
  name: string
  url: string
}

interface GetProjectsByOrganizationResponse {
  count: number
  projects: ProjectDto[]
}

const organizationName = route.params.id as string
const projects = ref<ProjectDto[]>([])
const isLoading = ref(false)

const fetchProjects = async () => {
  isLoading.value = true
  try {
    const response = await fetchWithAuth(
      `http://localhost:4000/api/organization/${organizationName}/projects`
    )

    if (response.ok) {
      const data: GetProjectsByOrganizationResponse = await response.json()
      projects.value = data.projects
    } else {
      console.error('Failed to fetch projects')
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const selectProject = (project: ProjectDto) => {
  router.push(`/app/organizations/${organizationName}/projects/${project.id}/repos`)
}

const goBack = () => {
  router.push('/app/organizations')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Breadcrumb -->
    <div class="flex items-center gap-3 mb-4">
      <button
        @click="goBack"
        class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
      >
        ←
      </button>
      <h1 class="text-3xl font-bold text-white">Projects</h1>
    </div>

    <div>
      <h2 class="text-xl text-slate-300 font-semibold mb-1">Organization Projects</h2>
      <p class="text-slate-400">Select a project to view its repositories and code reviews.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-slate-400">Loading projects...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="projects.length === 0" class="text-center py-12">
      <p class="text-slate-400">No projects found</p>
    </div>

    <!-- Projects List -->
    <div v-else class="space-y-3">
      <div
        v-for="project in projects"
        :key="project.id"
        @click="selectProject(project)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-white font-bold text-lg">{{ project.name }}</h3>
            </div>

            <a
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-400 hover:text-blue-300 text-sm mb-4 block break-all hover:underline"
            >
              {{ project.url }}
            </a>
          </div>

          <span class="text-slate-400 text-2xl ml-4">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
