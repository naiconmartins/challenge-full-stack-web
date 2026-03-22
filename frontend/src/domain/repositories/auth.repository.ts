import type { LoginCredentials, TokenResponse } from '@/domain/entities/auth.entity'

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<TokenResponse>
}
