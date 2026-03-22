import { httpClient } from './http'
import type {
  CreateStudentDto,
  ListStudentsParams,
  Student,
  StudentListResponse,
  UpdateStudentDto,
} from '@/types/student'

export const studentsService = {
  async list(params?: ListStudentsParams): Promise<StudentListResponse> {
    const response = await httpClient.get<StudentListResponse>('/students', { params })
    return response.data
  },

  async getById(id: string): Promise<Student> {
    const response = await httpClient.get<Student>(`/students/${id}`)
    return response.data
  },

  async create(data: CreateStudentDto): Promise<Student> {
    const response = await httpClient.post<Student>('/students', data)
    return response.data
  },

  async update(id: string, data: UpdateStudentDto): Promise<Student> {
    const response = await httpClient.put<Student>(`/students/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/students/${id}`)
  },
}
