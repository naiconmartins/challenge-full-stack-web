import "reflect-metadata";

import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";
import { StudentsInMemoryRepository } from "@/modules/students/infrastructure/in-memory/repositories/students-in-memory.repository";
import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { GetStudentUseCase } from "./get-student.usecase";

describe("GetStudentUseCase Unit Tests", () => {
  let sut: GetStudentUseCase.UseCase;
  let repository: StudentsRepository;

  beforeEach(() => {
    repository = new StudentsInMemoryRepository();
    sut = new GetStudentUseCase.UseCase(repository);
  });

  it("should throw NotFoundError when student does not exist", async () => {
    await expect(sut.execute({ id: "id-inexistente" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should return the student when found", async () => {
    const spyFindById = jest.spyOn(repository, "findById");

    const student = repository.create(StudentsDataBuilder({}));
    await repository.insert(student);

    const result = await sut.execute({ id: student.id });

    expect(result.id).toBe(student.id);
    expect(result.ra).toBe(student.ra);
    expect(result.name).toBe(student.name);
    expect(result.email).toBe(student.email);
    expect(result.cpf).toBe(student.cpf);
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });
});
