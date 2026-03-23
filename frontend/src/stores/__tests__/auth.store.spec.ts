import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth.store'
import { AppError } from '@/errors/app.error'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}))

vi.mock('@/services/auth.service', () => ({
  authService: { login: mocks.login, logout: mocks.logout },
}))

vi.mock('@/services/http', () => ({
  httpClient: {},
  AUTH_TOKEN_KEY: 'access_token',
  setAuthToken: mocks.setAuthToken,
  clearAuthToken: mocks.clearAuthToken,
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('isAuthenticated', () => {
    it('should return false when there is no token in localStorage', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should return true when there is a token in localStorage', () => {
      localStorage.setItem('access_token', 'my-token')
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('login', () => {
    const credentials = { email: 'user@example.com', password: '123456' }

    it('should set isLoading to true while logging in and false after', async () => {
      let resolvePromise!: (value: { access_token: string }) => void
      mocks.login.mockReturnValue(
        new Promise((res) => { resolvePromise = res }),
      )

      const store = useAuthStore()
      const promise = store.login(credentials)

      expect(store.isLoading).toBe(true)

      resolvePromise({ access_token: 'token' })
      await promise

      expect(store.isLoading).toBe(false)
    })

    it('should call setAuthToken with the returned token on success', async () => {
      mocks.login.mockResolvedValue({ access_token: 'abc123' })

      const store = useAuthStore()
      await store.login(credentials)

      expect(mocks.setAuthToken).toHaveBeenCalledWith('abc123')
    })

    it('should clear error before each call', async () => {
      const appError = new AppError('Unauthorized', 401)
      mocks.login.mockRejectedValueOnce(appError)
      mocks.login.mockResolvedValueOnce({ access_token: 'token' })

      const store = useAuthStore()

      await store.login(credentials).catch(() => {})
      expect(store.error).toEqual(appError)

      await store.login(credentials)
      expect(store.error).toBeNull()
    })

    it('should keep the AppError when service throws an AppError', async () => {
      const appError = new AppError('Unauthorized', 401)
      mocks.login.mockRejectedValue(appError)

      const store = useAuthStore()
      await store.login(credentials).catch(() => {})

      expect(store.error).toBe(appError)
    })

    it('should wrap unknown errors in AppError', async () => {
      mocks.login.mockRejectedValue(new Error('network failure'))

      const store = useAuthStore()
      await store.login(credentials).catch(() => {})

      expect(store.error).toBeInstanceOf(AppError)
      expect(store.error?.message).toBe('Erro inesperado.')
      expect(store.error?.statusCode).toBe(0)
    })

    it('should always rethrow the error', async () => {
      const appError = new AppError('Unauthorized', 401)
      mocks.login.mockRejectedValue(appError)

      const store = useAuthStore()

      await expect(store.login(credentials)).rejects.toBeInstanceOf(AppError)
    })

    it('should set isLoading to false even when it throws', async () => {
      mocks.login.mockRejectedValue(new Error('fail'))

      const store = useAuthStore()
      await store.login(credentials).catch(() => {})

      expect(store.isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    it('should call authService.logout', async () => {
      mocks.logout.mockResolvedValue(undefined)
      const store = useAuthStore()
      await store.logout()

      expect(mocks.logout).toHaveBeenCalledOnce()
    })

    it('should call clearAuthToken after revoking token', async () => {
      mocks.logout.mockResolvedValue(undefined)
      const store = useAuthStore()
      await store.logout()

      expect(mocks.clearAuthToken).toHaveBeenCalledOnce()
    })

    it('should clear token state after revoking', async () => {
      mocks.logout.mockResolvedValue(undefined)
      localStorage.setItem('access_token', 'my-token')
      const store = useAuthStore()
      await store.logout()

      expect(store.isAuthenticated).toBe(false)
    })

    it('should clear local token even when service call fails', async () => {
      mocks.logout.mockRejectedValue(new Error('network error'))
      const store = useAuthStore()
      await store.logout().catch(() => {})

      expect(mocks.clearAuthToken).toHaveBeenCalledOnce()
    })
  })
})
