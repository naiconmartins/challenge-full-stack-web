import type { Student, UpdateStudentDto } from '@/domain/entities/student.entity'
import type { IStudentRepository } from '@/domain/repositories/student.repository'

export class UpdateStudentUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(id: string, data: UpdateStudentDto): Promise<Student> {
    return this.studentRepository.update(id, data)
  }
}
