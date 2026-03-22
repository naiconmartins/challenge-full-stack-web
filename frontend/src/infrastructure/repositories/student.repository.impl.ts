import type {
  CreateStudentDto,
  ListStudentsParams,
  Student,
  StudentListResponse,
  UpdateStudentDto,
} from '@/domain/entities/student.entity'
import type { IStudentRepository } from '@/domain/repositories/student.repository'
import { httpClient } from '@/infrastructure/http/http-client'

export class StudentRepositoryImpl implements IStudentRepository {
  async list(params?: ListStudentsParams): Promise<StudentListResponse> {
    const response = await httpClient.get<StudentListResponse>('/students', { params })
    return response.data
  }

  async getById(id: string): Promise<Student> {
    const response = await httpClient.get<Student>(`/students/${id}`)
    return response.data
  }

  async create(data: CreateStudentDto): Promise<Student> {
    const response = await httpClient.post<Student>('/students', data)
    return response.data
  }

  async update(id: string, data: UpdateStudentDto): Promise<Student> {
    const response = await httpClient.put<Student>(`/students/${id}`, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/students/${id}`)
  }
}
