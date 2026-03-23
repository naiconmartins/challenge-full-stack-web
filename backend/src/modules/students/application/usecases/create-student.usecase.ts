import { inject, injectable } from "tsyringe";
import { StudentsRepository } from "../../domain/repositories/students.repository";
import { StudentOutput } from "../dto/student-output.dto";

export namespace CreateStudentUseCase {
  export type Input = {
    ra: string;
    name: string;
    email: string;
    cpf: string;
    created_by: string;
  };

  export type Output = StudentOutput;

  @injectable()
  export class UseCase {
    constructor(
      @inject("StudentRepository")
      private studentsRepository: StudentsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const normalizedInput = {
        ...input,
        email: input.email.trim().toLowerCase(),
        cpf: input.cpf.replace(/\D/g, ""),
      };

      await this.studentsRepository.conflictingCpf(normalizedInput.cpf);
      await this.studentsRepository.conflictingRa(input.ra);
      await this.studentsRepository.conflictingEmail(normalizedInput.email);

      const student = this.studentsRepository.create({
        ...normalizedInput,
        updated_by: null,
      });
      const createdStudent: StudentOutput =
        await this.studentsRepository.insert(student);

      return createdStudent;
    }
  }
}
