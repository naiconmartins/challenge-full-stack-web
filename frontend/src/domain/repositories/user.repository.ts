import type { CreateUserDto, User } from '@/domain/entities/user.entity'

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>
}
