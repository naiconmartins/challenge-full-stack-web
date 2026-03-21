import { inject, injectable } from "tsyringe";
import { StudentsRepository } from "../../domain/repositories/students.repository";

export namespace DeleteStudentUseCase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  @injectable()
  export class UseCase {
    constructor(
      @inject("StudentRepository")
      private studentRepository: StudentsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.studentRepository.delete(input.id);
    }
  }
}
