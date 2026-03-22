import type { CreateUserDto, User } from '@/domain/entities/user.entity'
import type { IUserRepository } from '@/domain/repositories/user.repository'

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDto): Promise<User> {
    return this.userRepository.create(data)
  }
}
