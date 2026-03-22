import type { IStudentRepository } from '@/domain/repositories/student.repository'

export class DeleteStudentUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(id: string): Promise<void> {
    return this.studentRepository.delete(id)
  }
}
