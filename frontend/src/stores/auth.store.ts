import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { setAuthToken, clearAuthToken, AUTH_TOKEN_KEY } from '@/services/http'
import type { LoginCredentials } from '@/types/auth'
import { AppError } from '@/errors/app.error'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY))
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
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      clearAuthToken()
      token.value = null
    }
  }

  return { isLoading, error, isAuthenticated, login, logout }
})
