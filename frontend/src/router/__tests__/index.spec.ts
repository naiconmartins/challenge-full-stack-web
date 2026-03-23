import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/views/LoginView.vue', () => ({ default: {} }))
vi.mock('@/views/HomeView.vue', () => ({ default: {} }))
vi.mock('@/views/StudentFormView.vue', () => ({ default: {} }))

import router from '@/router'

const state = vi.hoisted(() => ({ isAuthenticated: false }))

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({ isAuthenticated: state.isAuthenticated }),
}))

describe('router guards', () => {
  beforeEach(async () => {
    state.isAuthenticated = false
    await router.replace('/login').catch(() => {})
  })

  describe('requiresAuth routes', () => {
    it('redirects unauthenticated user from / to /login', async () => {
      state.isAuthenticated = false
      await router.push('/')
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('allows authenticated user to access /', async () => {
      state.isAuthenticated = true
      await router.push('/')
      expect(router.currentRoute.value.name).toBe('home')
    })

    it('redirects unauthenticated user from /students/create to /login', async () => {
      state.isAuthenticated = false
      await router.push('/students/create')
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('allows authenticated user to access /students/create', async () => {
      state.isAuthenticated = true
      await router.push('/students/create')
      expect(router.currentRoute.value.name).toBe('student-create')
    })
  })

  describe('requiresGuest routes', () => {
    it('allows unauthenticated user to access /login', async () => {
      state.isAuthenticated = false
      await router.push('/login')
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('redirects authenticated user from /login to /', async () => {
      state.isAuthenticated = true
      await router.push('/students/create')
      await router.push('/login')
      expect(router.currentRoute.value.name).toBe('home')
    })
  })
})
