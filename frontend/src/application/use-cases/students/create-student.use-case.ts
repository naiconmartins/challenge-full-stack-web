import type { CreateStudentDto, Student } from '@/domain/entities/student.entity'
import type { IStudentRepository } from '@/domain/repositories/student.repository'

export class CreateStudentUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(data: CreateStudentDto): Promise<Student> {
    return this.studentRepository.create(data)
  }
}
