import type { ListStudentsParams, StudentListResponse } from '@/domain/entities/student.entity'
import type { IStudentRepository } from '@/domain/repositories/student.repository'

export class ListStudentsUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(params?: ListStudentsParams): Promise<StudentListResponse> {
    return this.studentRepository.list(params)
  }
}
