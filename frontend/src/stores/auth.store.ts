import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { AuthRepositoryImpl } from '@/infrastructure/repositories/auth.repository.impl'
import { setAuthToken, clearAuthToken } from '@/infrastructure/http/http-client'
import type { LoginCredentials } from '@/domain/entities/auth.entity'
import { AppError } from '@/domain/errors/app.error'

const authRepository = new AuthRepositoryImpl()
const loginUseCase = new LoginUseCase(authRepository)

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  const isAuthenticated = computed(() => !!localStorage.getItem('access_token'))

  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const { access_token } = await loginUseCase.execute(credentials)
      setAuthToken(access_token)
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    clearAuthToken()
  }

  return { isLoading, error, isAuthenticated, login, logout }
})
