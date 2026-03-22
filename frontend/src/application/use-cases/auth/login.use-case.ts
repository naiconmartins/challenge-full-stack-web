import type { LoginCredentials, TokenResponse } from '@/domain/entities/auth.entity'
import type { IAuthRepository } from '@/domain/repositories/auth.repository'

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<TokenResponse> {
    return this.authRepository.login(credentials)
  }
}
