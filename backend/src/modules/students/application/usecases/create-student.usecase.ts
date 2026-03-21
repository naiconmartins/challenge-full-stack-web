import { inject, injectable } from "tsyringe";
import { StudentsRepository } from "../../domain/repositories/students.repository";
import { StudentOutput } from "../dto/student-output.dto";

export namespace CreateStudentUseCase {
  export type Input = {
    ra: string;
    name: string;
    email: string;
    cpf: string;
  };

  export type Output = StudentOutput;

  @injectable()
  export class UseCase {
    constructor(
      @inject("StudentRepository")
      private studentsRepository: StudentsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.studentsRepository.conflictingCpf(input.cpf);
      await this.studentsRepository.conflictingRa(input.ra);
      await this.studentsRepository.conflictingEmail(input.email);

      const student = this.studentsRepository.create({
        ...input,
        created_by: null,
        updated_by: null,
      });
      const createdStudent: StudentOutput =
        await this.studentsRepository.insert(student);

      return createdStudent;
    }
  }
}
