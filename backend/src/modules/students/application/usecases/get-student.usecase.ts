import { inject, injectable } from "tsyringe";
import { StudentsRepository } from "../../domain/repositories/students.repository";
import { StudentOutput } from "../dto/student-output.dto";

export namespace GetStudentUseCase {
  export type Input = {
    id: string;
  };

  export type Output = StudentOutput;

  @injectable()
  export class UseCase {
    constructor(
      @inject("StudentRepository")
      private studentsRepository: StudentsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const student: StudentOutput = await this.studentsRepository.findById(
        input.id,
      );

      return student;
    }
  }
}
