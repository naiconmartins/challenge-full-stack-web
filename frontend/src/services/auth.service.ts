import { httpClient } from '@/infra/http'
import type { AuthUser, LoginCredentials, TokenResponse } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await httpClient.post<TokenResponse>('/auth/login', credentials)
    return response.data
  },

  async me(): Promise<AuthUser> {
    const response = await httpClient.get<AuthUser>('/auth/me')
    return response.data
  },

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout')
  },
}
