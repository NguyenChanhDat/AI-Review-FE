<script setup lang="ts">
import { ref, computed } from 'vue'

interface KnowledgeDocument {
  id: string
  name: string
  description: string
  category: string
  status: 'learned' | 'processing'
  fileSize: string
  uploadDate: string
  vectors: number
}

const documents = ref<KnowledgeDocument[]>([
  {
    id: '1',
    name: 'Company_Coding_Standards.pdf',
    description: 'Internal coding standards and best practices',
    category: 'Coding Convention',
    status: 'learned',
    fileSize: '2.4 MB',
    uploadDate: '2026-01-15',
    vectors: 1250,
  },
  {
    id: '2',
    name: 'React Style Guide.md',
    description: 'React component structure and naming conventions',
    category: 'Style Guide',
    status: 'learned',
    fileSize: '156 KB',
    uploadDate: '2026-01-20',
    vectors: 340,
  },
  {
    id: '3',
    name: 'API_Boilerplate_Examples.zip',
    description: 'Standard API endpoint templates and middleware',
    category: 'Boilerplate Code',
    status: 'processing',
    fileSize: '42 MB',
    uploadDate: '2026-02-01',
    vectors: 0,
  },
  {
    id: '4',
    name: 'Security_Guidelines.pdf',
    description: 'Security requirements and vulnerability prevention',
    category: 'Coding Principle',
    status: 'learned',
    fileSize: '1.8 MB',
    uploadDate: '2026-02-03',
    vectors: 890,
  },
])

const getStatusColor = (status: string) => {
  return status === 'learned' ? 'bg-green-950 text-green-300' : 'bg-orange-950 text-orange-300'
}

const totalDocuments = computed(() => documents.value.length)
const learnedCount = computed(() => documents.value.filter((d) => d.status === 'learned').length)
const processingCount = computed(
  () => documents.value.filter((d) => d.status === 'processing').length,
)
const totalVectors = computed(() => documents.value.reduce((sum, d) => sum + d.vectors, 0))

const deleteDocument = (id: string) => {
  documents.value = documents.value.filter((d) => d.id !== id)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">RAG Knowledge Base</h1>
        <p class="text-slate-400">
          Upload coding conventions, principles, and boilerplate code for the AI to learn from
        </p>
      </div>
      <button
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
      >
        📤 Upload Document
      </button>
    </div>

    <!-- Documents List -->
    <div class="space-y-3">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Document Name and Status -->
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xl">📄</span>
              <h3 class="text-white font-semibold text-lg">{{ doc.name }}</h3>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusColor(doc.status)]">
                {{ doc.status === 'learned' ? '✓ Learned' : '⟳ Processing' }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-slate-400 text-sm mb-3">{{ doc.description }}</p>

            <!-- Metadata -->
            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span class="bg-slate-700 px-2 py-1 rounded">{{ doc.category }}</span>
              <span>{{ doc.fileSize }}</span>
              <span>Uploaded {{ doc.uploadDate }}</span>
              <span v-if="doc.vectors > 0">🔢 {{ doc.vectors }} vectors</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 ml-4">
            <button
              class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Download"
            >
              📥
            </button>
            <button
              v-if="doc.status === 'learned'"
              class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Re-learn"
            >
              🔄
            </button>
            <button
              @click="deleteDocument(doc.id)"
              class="p-2 hover:bg-red-900 rounded-lg transition-colors text-slate-400 hover:text-red-300"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-4 gap-4 pt-4 border-t border-slate-700">
      <div class="text-center">
        <p class="text-2xl font-bold text-white">{{ totalDocuments }}</p>
        <p class="text-slate-400 text-sm mt-1">Total Documents</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-white">{{ learnedCount }}</p>
        <p class="text-slate-400 text-sm mt-1">Learned</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-white">{{ processingCount }}</p>
        <p class="text-slate-400 text-sm mt-1">Processing</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-blue-400">{{ totalVectors.toLocaleString() }}</p>
        <p class="text-slate-400 text-sm mt-1">Total Vectors</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
