import type { LoginCredentials, TokenResponse } from '@/domain/entities/auth.entity'
import type { IAuthRepository } from '@/domain/repositories/auth.repository'
import { httpClient } from '@/infrastructure/http/http-client'

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await httpClient.post<TokenResponse>('/auth/login', credentials)
    return response.data
  }
}
