<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface CodeComment {
  id: string
  line: number
  author: string
  severity: 'high' | 'medium' | 'low'
  comment: string
  suggestion?: string
}

const reviewId = route.params.reviewId as string
const orgId = route.params.orgId as string
const projectId = route.params.projectId as string
const repoId = route.params.repoId as string

const codeLines = ref([
  { number: 1, code: 'import { hash, compare } from "bcrypt";' },
  { number: 2, code: 'import { User } from "../models/user";' },
  { number: 3, code: '' },
  { number: 4, code: 'export async function authenticateUser(' },
  { number: 5, code: '  email: string,' },
  { number: 6, code: '  password: string' },
  { number: 7, code: ') {' },
  { number: 8, code: '  const user = await User.findByEmail(email);' },
  { number: 9, code: '  if (!user) {' },
  { number: 10, code: '    throw new Error("User not found");' },
  { number: 11, code: '  }' },
  { number: 12, code: '' },
  {
    number: 13,
    code: '  // BUG: No input validation before processing',
  },
  { number: 14, code: '  const isPasswordValid = await compare(password, user.password);' },
  { number: 15, code: '' },
  { number: 16, code: '  if (!isPasswordValid) {' },
  { number: 17, code: '    throw new Error("Invalid password");' },
  { number: 18, code: '  }' },
  { number: 19, code: '' },
  {
    number: 20,
    code: '  // TODO: Add rate limiting to prevent brute force attacks',
  },
  { number: 21, code: '  return user;' },
  { number: 22, code: '}' },
])

const comments = ref<CodeComment[]>([
  {
    id: 'c1',
    line: 13,
    author: 'AI Reviewer',
    severity: 'high',
    comment: 'Missing input validation and sanitization',
    suggestion:
      'Add email format validation and password length checks before processing.',
  },
  {
    id: 'c2',
    line: 20,
    author: 'AI Reviewer',
    severity: 'high',
    comment: 'Security risk: No rate limiting on authentication attempts',
    suggestion:
      'Implement rate limiting or account lockout mechanism after failed attempts.',
  },
  {
    id: 'c3',
    line: 10,
    author: 'AI Reviewer',
    severity: 'medium',
    comment: 'Error message is too generic',
    suggestion: 'Use generic error messages to avoid user enumeration attacks.',
  },
])

const selectedComment = ref<CodeComment | null>(null)

const goBack = () => {
  router.push(
    `/app/organizations/${orgId}/projects/${projectId}/repos/${repoId}/reviews`
  )
}

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    high: 'bg-red-950 text-red-300',
    medium: 'bg-orange-950 text-orange-300',
    low: 'bg-green-950 text-green-300',
  }
  return colors[severity] || 'bg-slate-700 text-slate-300'
}

const hasCommentOnLine = (lineNumber: number) => {
  return comments.value.some((c) => c.line === lineNumber)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button
        @click="goBack"
        class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
      >
        ←
      </button>
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-white">src/services/auth.ts</h1>
        <div class="flex items-center gap-3 mt-2 text-sm">
          <span class="px-2 py-1 rounded text-xs font-medium bg-red-950 text-red-300">
            High severity
          </span>
          <span class="px-2 py-1 rounded text-xs font-medium bg-red-950 text-red-300">
            Changes Required
          </span>
          <span class="text-slate-400">2 hours ago</span>
          <span class="text-slate-400">by AI Reviewer</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Code View -->
      <div class="lg:col-span-3">
        <div class="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div class="border-b border-slate-700 p-4 bg-slate-900 font-mono text-sm text-slate-400">
            src/services/auth.ts
          </div>
          <div class="overflow-x-auto bg-slate-900">
            <pre class="p-4 font-mono text-sm text-slate-300"><span
              v-for="line in codeLines"
              :key="line.number"
              :class="[
                'block hover:bg-slate-700/30 py-1',
                { 'bg-red-950/20': hasCommentOnLine(line.number) },
              ]"
            ><span class="text-slate-500 mr-4 inline-block w-8 text-right">{{ line.number }}</span><span
                :class="[
                  'text-slate-300',
                  line.code.includes('BUG') || line.code.includes('TODO')
                    ? 'text-orange-400 font-semibold'
                    : '',
                ]"
              >{{ line.code }}</span></span>
            </pre>
          </div>
        </div>
      </div>

      <!-- Comments Sidebar -->
      <div class="space-y-4">
        <div class="bg-slate-800 border border-slate-700 rounded-lg sticky top-6">
          <div class="border-b border-slate-700 p-4 font-semibold text-white text-sm">Comments</div>
          <div class="divide-y divide-slate-700">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="p-4 hover:bg-slate-700/30 cursor-pointer transition-colors"
              :class="{ 'bg-slate-700/50': selectedComment?.id === comment.id }"
              @click="selectedComment = comment"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-white text-xs font-bold">Line {{ comment.line }}</span>
                <span :class="['px-2 py-1 rounded text-xs font-medium', getSeverityColor(comment.severity)]">
                  {{ comment.severity }}
                </span>
              </div>
              <p class="text-slate-300 text-xs line-clamp-2">{{ comment.comment }}</p>
            </div>
          </div>
        </div>

        <!-- Comment Detail -->
        <div v-if="selectedComment" class="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 class="text-white font-semibold text-sm mb-4">Comment Detail</h3>
          <div class="space-y-4">
            <div>
              <p class="text-slate-400 text-xs mb-1">Line</p>
              <p class="text-white font-mono">{{ selectedComment.line }}</p>
            </div>
            <div>
              <p class="text-slate-400 text-xs mb-1">Severity</p>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getSeverityColor(selectedComment.severity)]">
                {{ selectedComment.severity }}
              </span>
            </div>
            <div>
              <p class="text-slate-400 text-xs mb-1">Comment</p>
              <p class="text-slate-300 text-sm">{{ selectedComment.comment }}</p>
            </div>
            <div v-if="selectedComment.suggestion">
              <p class="text-slate-400 text-xs mb-1">Suggestion</p>
              <div class="bg-green-950/30 border border-green-900/30 rounded p-3">
                <p class="text-green-400 text-sm">{{ selectedComment.suggestion }}</p>
              </div>
            </div>
            <button class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors text-sm">
              ✓ Mark as Fixed
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 class="text-white font-semibold mb-4">Review Summary</h2>
      <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-slate-400 text-sm">Total Issues</p>
            <p class="text-2xl font-bold text-white">{{ comments.length }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-sm">High Severity</p>
            <p class="text-2xl font-bold text-red-400">
              {{ comments.filter((c) => c.severity === 'high').length }}
            </p>
          </div>
          <div>
            <p class="text-slate-400 text-sm">Medium Severity</p>
            <p class="text-2xl font-bold text-orange-400">
              {{ comments.filter((c) => c.severity === 'medium').length }}
            </p>
          </div>
        </div>
        <div class="border-t border-slate-700 pt-4">
          <p class="text-slate-400 text-sm mb-2">Actions</p>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg transition-colors">
              ✓ Approve
            </button>
            <button class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-lg transition-colors">
              📝 Request Changes
            </button>
            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors">
              💬 Comment
            </button>
          </div>
        </div>
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
