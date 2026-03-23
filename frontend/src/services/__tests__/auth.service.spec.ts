import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../auth.service'

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock('@/infra/http', () => ({
  httpClient: { post: mocks.post },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('posts credentials and returns token response', async () => {
      const credentials = { email: 'user@example.com', password: '123456' }
      const tokenResponse = { access_token: 'abc123' }
      mocks.post.mockResolvedValue({ data: tokenResponse })

      const result = await authService.login(credentials)

      expect(mocks.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(tokenResponse)
    })
  })

  describe('logout', () => {
    it('posts to /auth/logout', async () => {
      mocks.post.mockResolvedValue({})

      await authService.logout()

      expect(mocks.post).toHaveBeenCalledWith('/auth/logout')
    })

    it('propagates errors from the service', async () => {
      mocks.post.mockRejectedValue(new Error('unauthorized'))

      await expect(authService.logout()).rejects.toThrow('unauthorized')
    })
  })
})
