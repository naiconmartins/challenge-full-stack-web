import type { Student } from '@/domain/entities/student.entity'
import type { IStudentRepository } from '@/domain/repositories/student.repository'

export class GetStudentUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(id: string): Promise<Student> {
    return this.studentRepository.getById(id)
  }
}
