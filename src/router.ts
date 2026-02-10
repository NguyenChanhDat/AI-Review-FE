import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'
import Dashboard from './pages/Dashboard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/onboarding/auth',
  },
  {
    path: '/onboarding/auth',
    name: 'OnboardingAuth',
    component: () => import('./pages/OnboardingAuth.vue'),
  },
  {
    path: '/onboarding/repo-provider',
    name: 'OnboardingRepoProvider',
    component: () => import('./pages/OnboardingRepoProvider.vue'),
  },
  {
    path: '/onboarding/pat',
    name: 'OnboardingPAT',
    component: () => import('./pages/OnboardingPAT.vue'),
  },
  {
    path: '/app',
    component: AppLayout,
    children: [
      {
        path: '',
        redirect: '/app/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'organizations',
        name: 'Organizations',
        component: () => import('./pages/Organizations.vue'),
      },
      {
        path: 'organizations/:id/projects',
        name: 'Projects',
        component: () => import('./pages/Projects.vue'),
      },
      {
        path: 'organizations/:orgId/projects/:projectId/repos',
        name: 'Repositories',
        component: () => import('./pages/Repositories.vue'),
      },
      {
        path: 'organizations/:orgId/projects/:projectId/repos/:repoId/reviews',
        name: 'CodeReviews',
        component: () => import('./pages/CodeReviews.vue'),
      },
      {
        path: 'organizations/:orgId/projects/:projectId/repos/:repoId/reviews/:reviewId',
        name: 'ReviewDetails',
        component: () => import('./pages/ReviewDetails.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('./pages/Settings.vue'),
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('./pages/Analytics.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
