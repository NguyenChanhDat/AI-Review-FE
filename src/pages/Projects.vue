<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface Project {
  id: string
  name: string
  description: string
  repos: number
  members: number
  status: 'active' | 'archived'
  progress: number
}

const orgId = route.params.id as string

const organizationName = computed(() => {
  const orgMap: Record<string, string> = {
    '1': 'TechCorp',
    '2': 'DataInc',
    '3': 'SecureApp',
    '4': 'CloudSys',
  }
  return orgMap[orgId] || 'Organization'
})

const projects = ref<Project[]>([
  {
    id: '1',
    name: 'Backend Services',
    description: 'Core API and microservices',
    repos: 8,
    members: 12,
    status: 'active',
    progress: 85,
  },
  {
    id: '2',
    name: 'Frontend Applications',
    description: 'Web and mobile UI applications',
    repos: 6,
    members: 9,
    status: 'active',
    progress: 72,
  },
  {
    id: '3',
    name: 'Data Pipeline',
    description: 'ETL and analytics infrastructure',
    repos: 4,
    members: 6,
    status: 'active',
    progress: 95,
  },
  {
    id: '4',
    name: 'DevOps & Infra',
    description: 'Infrastructure as code and CI/CD',
    repos: 3,
    members: 5,
    status: 'active',
    progress: 88,
  },
  {
    id: '5',
    name: 'Security Tools',
    description: 'Authentication and authorization',
    repos: 5,
    members: 7,
    status: 'active',
    progress: 78,
  },
  {
    id: '6',
    name: 'Legacy Systems',
    description: 'Maintenance and deprecated code',
    repos: 2,
    members: 3,
    status: 'archived',
    progress: 45,
  },
])

const selectProject = (project: Project) => {
  router.push(`/app/organizations/${orgId}/projects/${project.id}/repos`)
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
      <h1 class="text-3xl font-bold text-white">{{ organizationName }}</h1>
    </div>

    <div>
      <h2 class="text-xl text-slate-300 font-semibold mb-1">Projects</h2>
      <p class="text-slate-400">Select a project to view its repositories and code reviews.</p>
    </div>

    <!-- Projects List -->
    <div class="space-y-3">
      <div
        v-for="project in projects"
        :key="project.id"
        @click="selectProject(project)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-white font-bold text-lg">{{ project.name }}</h3>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  project.status === 'active'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-slate-700 text-slate-300',
                ]"
              >
                {{ project.status }}
              </span>
            </div>
            <p class="text-slate-400 text-sm mb-4">{{ project.description }}</p>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-slate-300 text-xs">Review Progress</span>
                <span class="text-slate-300 text-xs font-semibold">{{ project.progress }}%</span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-blue-600 h-full transition-all"
                  :style="{ width: `${project.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex gap-6 text-sm">
              <div class="flex items-center gap-2">
                <span>📦</span>
                <span class="text-slate-300">{{ project.repos }} repositories</span>
              </div>
              <div class="flex items-center gap-2">
                <span>👥</span>
                <span class="text-slate-300">{{ project.members }} members</span>
              </div>
            </div>
          </div>

          <span class="text-slate-400 text-2xl ml-4">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
