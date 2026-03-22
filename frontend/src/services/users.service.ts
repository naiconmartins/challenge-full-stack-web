import { httpClient } from './http'
import type { CreateUserDto, User } from '@/types/user'

export const usersService = {
  async create(data: CreateUserDto): Promise<User> {
    const response = await httpClient.post<User>('/users', data)
    return response.data
  },
}
