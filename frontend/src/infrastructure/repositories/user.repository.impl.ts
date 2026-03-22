import type { CreateUserDto, User } from '@/domain/entities/user.entity'
import type { IUserRepository } from '@/domain/repositories/user.repository'
import { httpClient } from '@/infrastructure/http/http-client'

export class UserRepositoryImpl implements IUserRepository {
  async create(data: CreateUserDto): Promise<User> {
    const response = await httpClient.post<User>('/users', data)
    return response.data
  }
}
