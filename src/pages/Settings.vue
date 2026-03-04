<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'general' | 'ai-model'>('general')
const reviewTimeout = ref(120)
const autoReviewMR = ref(false)
const autoPushComment = ref(false)
const enableCaching = ref(false)

const selectedModel = ref('gpt-4-turbo')
const autoSelectModel = ref(false)

const models = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most accurate, best for complex code reviews',
    cost: '$$$',
    quality: 'medium',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and cost',
    cost: '$$',
    quality: 'medium',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and cost-effective',
    cost: '$',
    quality: 'low',
  },
]

const mrSizeTiers = [
  {
    label: 'Small MRs',
    range: '< 100 lines changed',
    model: 'Claude 3 Haiku',
    cost: '$',
  },
  {
    label: 'Medium MRs',
    range: '100-500 lines',
    model: 'Claude 3 Sonnet',
    cost: '$$',
  },
  {
    label: 'Large MRs',
    range: '> 500 lines',
    model: 'GPT-4 Turbo',
    cost: '$$$',
  },
]

const getCostColor = (cost: string) => {
  if (cost === '$$$') return 'bg-red-900 text-red-300'
  if (cost === '$$') return 'bg-orange-900 text-orange-300'
  return 'bg-green-900 text-green-300'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Settings</h1>
      <p class="text-slate-400">Configure system preferences and integrations</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-slate-700">
      <div class="flex gap-8">
        <button
          type="button"
          @click="activeTab = 'general'"
          :class="[
            'py-4 font-medium border-b-2 transition-colors',
            activeTab === 'general'
              ? 'text-white border-blue-500'
              : 'text-slate-400 border-transparent hover:text-slate-300',
          ]"
        >
          General
        </button>
        <button
          type="button"
          @click="activeTab = 'ai-model'"
          :class="[
            'py-4 font-medium border-b-2 transition-colors',
            activeTab === 'ai-model'
              ? 'text-white border-blue-500'
              : 'text-slate-400 border-transparent hover:text-slate-300',
          ]"
        >
          AI Model
        </button>
      </div>
    </div>

    <!-- General Tab -->
    <div v-show="activeTab === 'general'" class="space-y-6">
      <h2 class="text-white font-semibold text-lg">Review Settings</h2>

      <!-- Review Timeout -->
      <div class="border-b border-slate-700 pb-6">
        <label class="text-slate-300 font-medium mb-3 block">Review Timeout (seconds)</label>
        <input
          v-model.number="reviewTimeout"
          type="number"
          class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full max-w-xs"
        />
        <p class="text-slate-400 text-sm mt-2">Maximum time for AI review</p>
      </div>

      <!-- Auto-review on MR creation -->
      <div class="border-b border-slate-700 pb-6 flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-white font-medium">Auto-review on MR creation</h3>
          <p class="text-slate-400 text-sm mt-1">
            Automatically trigger reviews when MRs are opened
          </p>
        </div>
        <button
          @click="autoReviewMR = !autoReviewMR"
          :class="[
            'relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4',
            autoReviewMR ? 'bg-blue-600' : 'bg-slate-700',
          ]"
        >
          <span
            :class="[
              'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
              autoReviewMR ? 'translate-x-6' : 'translate-x-0.5',
            ]"
          ></span>
        </button>
      </div>

      <!-- Auto-push AI review comment -->
      <div class="border-b border-slate-700 pb-6 flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-white font-medium">Auto-push AI review comment</h3>
          <p class="text-slate-400 text-sm mt-1">
            Automatically push AI review comment to PR without Required Reviewer's Approve
          </p>
        </div>
        <button
          @click="autoPushComment = !autoPushComment"
          :class="[
            'relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4',
            autoPushComment ? 'bg-blue-600' : 'bg-slate-700',
          ]"
        >
          <span
            :class="[
              'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
              autoPushComment ? 'translate-x-6' : 'translate-x-0.5',
            ]"
          ></span>
        </button>
      </div>

      <!-- Enable caching -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-white font-medium">Enable caching</h3>
          <p class="text-slate-400 text-sm mt-1">Cache results for identical code patterns</p>
        </div>
        <button
          @click="enableCaching = !enableCaching"
          :class="[
            'relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4',
            enableCaching ? 'bg-blue-600' : 'bg-slate-700',
          ]"
        >
          <span
            :class="[
              'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
              enableCaching ? 'translate-x-6' : 'translate-x-0.5',
            ]"
          ></span>
        </button>
      </div>
    </div>

    <!-- AI Model Tab -->
    <div v-show="activeTab === 'ai-model'" class="space-y-6">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🤖</span>
        <h2 class="text-white font-semibold text-lg">AI Model Selection</h2>
      </div>

      <!-- Default AI Model -->
      <div class="border-b border-slate-700 pb-6">
        <label class="text-slate-300 font-medium mb-3 block">Default AI Model</label>
        <p class="text-slate-400 text-sm mb-3">Select the model used for code reviews</p>

        <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <select
            v-model="selectedModel"
            class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer"
          >
            <option v-for="model in models" :key="model.id" :value="model.id">
              {{ model.name }}
            </option>
          </select>

          <div
            v-for="model in models"
            :key="model.id"
            v-show="selectedModel === model.id"
            class="mt-3"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-purple-400">🤖</span>
              <span class="text-white font-medium">{{ model.name }}</span>
              <span :class="['px-2 py-0.5 rounded text-xs font-medium', getCostColor(model.cost)]">
                {{ model.cost }}
              </span>
              <span class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-300">
                {{ model.quality }}
              </span>
            </div>
            <p class="text-slate-400 text-sm">{{ model.description }}</p>
          </div>
        </div>
      </div>

      <!-- Auto-select model based on MR size -->
      <div class="border-b border-slate-700 pb-6 flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-white font-medium">Auto-select model based on MR size</h3>
          <p class="text-slate-400 text-sm mt-1">
            Automatically choose cost-effective models for smaller MRs
          </p>
        </div>
        <button
          @click="autoSelectModel = !autoSelectModel"
          :class="[
            'relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4',
            autoSelectModel ? 'bg-blue-600' : 'bg-slate-700',
          ]"
        >
          <span
            :class="[
              'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
              autoSelectModel ? 'translate-x-6' : 'translate-x-0.5',
            ]"
          ></span>
        </button>
      </div>

      <!-- MR Size Tiers -->
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="tier in mrSizeTiers"
          :key="tier.label"
          class="bg-slate-800 border border-slate-700 rounded-lg p-4"
        >
          <div class="flex items-center gap-2 mb-2">
            <span :class="['px-2 py-0.5 rounded text-xs font-medium', getCostColor(tier.cost)]">
              {{ tier.cost }}
            </span>
            <span class="text-white font-medium text-sm">{{ tier.label }}</span>
          </div>
          <p class="text-slate-400 text-xs mb-2">{{ tier.range }}</p>
          <p class="text-white text-sm font-medium">{{ tier.model }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
