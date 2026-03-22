import { inject, injectable } from "tsyringe";
import { StudentsRepository } from "../../domain/repositories/students.repository";
import { StudentOutput } from "../dto/student-output.dto";

export namespace UpdateStudentUseCase {
  export type Input = {
    id: string;
    name: string;
    email: string;
    updated_by: string;
  };

  export type Output = StudentOutput;

  @injectable()
  export class UseCase {
    constructor(
      @inject("StudentRepository")
      private studentsRepository: StudentsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const student = await this.studentsRepository.findById(input.id);

      await this.studentsRepository.conflictingEmail(input.email, input.id);

      student.name = input.name;
      student.email = input.email;
      student.updated_by = input.updated_by;

      const updatedStudent: StudentOutput =
        await this.studentsRepository.update(student);

      return updatedStudent;
    }
  }
}
