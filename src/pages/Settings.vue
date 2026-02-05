<script setup lang="ts">
import { ref } from 'vue'

interface ReviewRule {
  id: string
  name: string
  description: string
  category: string
  severity: 'high' | 'medium' | 'low'
  enabled: boolean
}

const reviewRules = ref<ReviewRule[]>([
  {
    id: '1',
    name: 'SQL Injection Prevention',
    description: 'Detects potential SQL injection vulnerabilities in queries',
    category: 'Security',
    severity: 'high',
    enabled: true,
  },
  {
    id: '2',
    name: 'XSS Prevention',
    description: 'Identifies potential cross-site scripting vulnerabilities',
    category: 'Security',
    severity: 'high',
    enabled: true,
  },
  {
    id: '3',
    name: 'Performance Issues',
    description: 'Detects N+1 queries and inefficient loops',
    category: 'Performance',
    severity: 'medium',
    enabled: true,
  },
  {
    id: '4',
    name: 'Code Duplication',
    description: 'Identifies repeated code blocks',
    category: 'Code Quality',
    severity: 'low',
    enabled: true,
  },
  {
    id: '5',
    name: 'Missing Error Handling',
    description: 'Flags functions without proper error handling',
    category: 'Reliability',
    severity: 'medium',
    enabled: false,
  },
  {
    id: '6',
    name: 'Unused Variables',
    description: 'Detects unused variables and imports',
    category: 'Code Quality',
    severity: 'low',
    enabled: true,
  },
])

const activeTab = ref('rules')
const autoReview = ref(true)
const emailNotifications = ref(true)
const strictMode = ref(false)

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    high: 'bg-red-950 text-red-300',
    medium: 'bg-orange-950 text-orange-300',
    low: 'bg-green-950 text-green-300',
  }
  return colors[severity]
}

const toggleRule = (rule: ReviewRule) => {
  rule.enabled = !rule.enabled
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Settings</h1>
      <p class="text-slate-400">Customize your AI code review rules and configuration.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 border-b border-slate-700">
      <button
        @click="activeTab = 'rules'"
        :class="[
          'px-4 py-3 font-medium border-b-2 transition-colors',
          activeTab === 'rules'
            ? 'text-white border-blue-600'
            : 'text-slate-400 border-transparent hover:text-slate-300',
        ]"
      >
        📋 Review Rules
      </button>
      <button
        @click="activeTab = 'rag'"
        :class="[
          'px-4 py-3 font-medium border-b-2 transition-colors',
          activeTab === 'rag'
            ? 'text-white border-blue-600'
            : 'text-slate-400 border-transparent hover:text-slate-300',
        ]"
      >
        🧠 RAG Configuration
      </button>
      <button
        @click="activeTab = 'general'"
        :class="[
          'px-4 py-3 font-medium border-b-2 transition-colors',
          activeTab === 'general'
            ? 'text-white border-blue-600'
            : 'text-slate-400 border-transparent hover:text-slate-300',
        ]"
      >
        ⚙️ General Settings
      </button>
    </div>

    <!-- Rules Tab -->
    <div v-if="activeTab === 'rules'" class="space-y-4">
      <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
        ➕ Create New Rule
      </button>

      <!-- Rules List -->
      <div class="space-y-3">
        <div
          v-for="rule in reviewRules"
          :key="rule.id"
          :class="[
            'bg-slate-800 border border-slate-700 rounded-lg p-6',
            { 'opacity-50': !rule.enabled },
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-white font-bold text-lg">{{ rule.name }}</h3>
                <span :class="['px-2 py-1 rounded text-xs font-medium', getSeverityColor(rule.severity)]">
                  {{ rule.severity }}
                </span>
                <span class="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300">
                  {{ rule.category }}
                </span>
              </div>
              <p class="text-slate-400 text-sm mb-2">{{ rule.description }}</p>
            </div>

            <div class="flex items-center gap-2 ml-4">
              <button
                @click="toggleRule(rule)"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  rule.enabled ? 'bg-blue-600' : 'bg-slate-700',
                ]"
              >
                <span
                  :class="[
                    'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
                    rule.enabled ? 'translate-x-6' : 'translate-x-0.5',
                  ]"
                ></span>
              </button>
              <button class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
                ✏️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RAG Configuration Tab -->
    <div v-if="activeTab === 'rag'" class="space-y-4">
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 class="text-white font-semibold mb-4">RAG Model Configuration</h2>
        <div class="space-y-4">
          <div>
            <label class="text-slate-300 text-sm font-medium mb-2 block">
              Knowledge Base
            </label>
            <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
              <option>Internal Codebase</option>
              <option>Community Standards</option>
              <option>Custom Rules</option>
            </select>
          </div>

          <div>
            <label class="text-slate-300 text-sm font-medium mb-2 block">
              Model Temperature: 0.7
            </label>
            <input type="range" min="0" max="1" step="0.1" value="0.7" class="w-full">
            <p class="text-slate-400 text-xs mt-2">
              Controls creativity/randomness of AI suggestions (0 = deterministic, 1 = creative)
            </p>
          </div>

          <div>
            <label class="text-slate-300 text-sm font-medium mb-2 block">
              Context Window Size
            </label>
            <input type="number" value="2048" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
          </div>

          <div>
            <label class="text-slate-300 text-sm font-medium mb-2 block">
              Custom Documentation
            </label>
            <textarea
              placeholder="e.g., Must use async/await instead of promises..."
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white resize-none"
              rows="4"
            ></textarea>
          </div>

          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
            💾 Save RAG Configuration
          </button>
        </div>
      </div>
    </div>

    <!-- General Settings Tab -->
    <div v-if="activeTab === 'general'" class="space-y-4">
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 class="text-white font-semibold mb-4">General Settings</h2>
        <div class="space-y-4">
          <div class="border-b border-slate-700 pb-4 flex items-center justify-between">
            <div>
              <h3 class="text-white font-medium">Auto Review</h3>
              <p class="text-slate-400 text-sm">Automatically run reviews on new commits</p>
            </div>
            <button
              @click="autoReview = !autoReview"
              :class="[
                'relative w-12 h-6 rounded-full transition-colors',
                autoReview ? 'bg-blue-600' : 'bg-slate-700',
              ]"
            >
              <span
                :class="[
                  'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
                  autoReview ? 'translate-x-6' : 'translate-x-0.5',
                ]"
              ></span>
            </button>
          </div>

          <div class="border-b border-slate-700 pb-4 flex items-center justify-between">
            <div>
              <h3 class="text-white font-medium">Email Notifications</h3>
              <p class="text-slate-400 text-sm">Get notified when reviews are complete</p>
            </div>
            <button
              @click="emailNotifications = !emailNotifications"
              :class="[
                'relative w-12 h-6 rounded-full transition-colors',
                emailNotifications ? 'bg-blue-600' : 'bg-slate-700',
              ]"
            >
              <span
                :class="[
                  'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
                  emailNotifications ? 'translate-x-6' : 'translate-x-0.5',
                ]"
              ></span>
            </button>
          </div>

          <div class="border-b border-slate-700 pb-4 flex items-center justify-between">
            <div>
              <h3 class="text-white font-medium">Strict Mode</h3>
              <p class="text-slate-400 text-sm">Flag all warnings as blocking issues</p>
            </div>
            <button
              @click="strictMode = !strictMode"
              :class="[
                'relative w-12 h-6 rounded-full transition-colors',
                strictMode ? 'bg-blue-600' : 'bg-slate-700',
              ]"
            >
              <span
                :class="[
                  'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
                  strictMode ? 'translate-x-6' : 'translate-x-0.5',
                ]"
              ></span>
            </button>
          </div>

          <div>
            <label class="text-slate-300 text-sm font-medium mb-2 block">
              Review Threshold
            </label>
            <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
              <option>All Issues</option>
              <option>High + Medium</option>
              <option>High Only</option>
            </select>
            <p class="text-slate-400 text-xs mt-2">
              Minimum severity level to include in reviews
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
