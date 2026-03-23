import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { setAuthToken, clearAuthToken, AUTH_TOKEN_KEY } from '@/infra/http'
import type { AuthUser, LoginCredentials } from '@/types/auth'
import { AppError } from '@/errors/app.error'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY))
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const { access_token } = await authService.login(credentials)
      setAuthToken(access_token)
      token.value = access_token
      user.value = await authService.me()
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe(): Promise<AuthUser> {
    const profile = await authService.me()
    user.value = profile
    return profile
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      clearAuthToken()
      token.value = null
      user.value = null
    }
  }

  return { user, isLoading, error, isAuthenticated, login, fetchMe, logout }
})
