<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Organization {
  id: string
  name: string
  description: string
  repos: number
  teams: number
  icon: string
}

const organizations = ref<Organization[]>([
  {
    id: '1',
    name: 'TechCorp',
    description: 'Enterprise software solutions',
    repos: 24,
    teams: 8,
    icon: '💼',
  },
  {
    id: '2',
    name: 'DataInc',
    description: 'Big data analytics platform',
    repos: 18,
    teams: 6,
    icon: '📊',
  },
  {
    id: '3',
    name: 'SecureApp',
    description: 'Security & compliance tools',
    repos: 12,
    teams: 5,
    icon: '🔒',
  },
  {
    id: '4',
    name: 'CloudSys',
    description: 'Cloud infrastructure management',
    repos: 31,
    teams: 12,
    icon: '☁️',
  },
  {
    id: '5',
    name: 'APIHub',
    description: 'RESTful API marketplace',
    repos: 45,
    teams: 15,
    icon: '🔌',
  },
  {
    id: '6',
    name: 'DevTools',
    description: 'Developer tools & utilities',
    repos: 8,
    teams: 3,
    icon: '🛠️',
  },
  {
    id: '7',
    name: 'AI Research',
    description: 'Machine learning & AI models',
    repos: 16,
    teams: 7,
    icon: '🧠',
  },
  {
    id: '8',
    name: 'MobileFirst',
    description: 'Mobile app development',
    repos: 22,
    teams: 9,
    icon: '📱',
  },
])

const selectOrganization = (org: Organization) => {
  router.push(`/organizations/${org.id}/projects`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Organizations</h1>
      <p class="text-slate-400">Select an organization to view projects and code reviews.</p>
    </div>

    <!-- Organization Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="org in organizations"
        :key="org.id"
        @click="selectOrganization(org)"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-center gap-4 mb-4">
          <span class="text-5xl">{{ org.icon }}</span>
          <h2 class="text-white font-bold text-lg">{{ org.name }}</h2>
        </div>

        <p class="text-slate-400 text-sm mb-4 line-clamp-2">{{ org.description }}</p>

        <div class="flex gap-4 text-sm mb-4">
          <div class="flex items-center gap-1">
            <span>📦</span>
            <span class="text-slate-300">{{ org.repos }} repos</span>
          </div>
          <div class="flex items-center gap-1">
            <span>👥</span>
            <span class="text-slate-300">{{ org.teams }} teams</span>
          </div>
        </div>

        <button class="w-full text-blue-400 hover:text-blue-300 text-sm font-medium">
          Select →
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
