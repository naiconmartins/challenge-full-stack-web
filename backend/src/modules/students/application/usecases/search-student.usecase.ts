import { inject, injectable } from "tsyringe";
import { StudentsRepository } from "../../domain/repositories/students.repository";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from "../dto/pagination-output.dto";
import { SearchInputDto } from "../dto/search-input.dto";
import { StudentOutput } from "../dto/student-output.dto";

export namespace SearchStudentUseCase {
  export type Input = SearchInputDto;

  export type Output = PaginationOutputDto<StudentOutput>;

  @injectable()
  export class UseCase {
    constructor(
      @inject("StudentRepository")
      private studentRepository: StudentsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.studentRepository.search(input);
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult);
    }
  }
}
