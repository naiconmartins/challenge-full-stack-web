import "reflect-metadata";

import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";
import { StudentsInMemoryRepository } from "@/modules/students/infrastructure/in-memory/repositories/students-in-memory.repository";
import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { DeleteStudentUseCase } from "./delete-student.usecase";

describe("DeleteStudentUseCase Unit Tests", () => {
  let sut: DeleteStudentUseCase.UseCase;
  let repository: StudentsRepository;

  beforeEach(() => {
    repository = new StudentsInMemoryRepository();
    sut = new DeleteStudentUseCase.UseCase(repository);
  });

  it("should throw NotFoundError when student does not exist", async () => {
    await expect(sut.execute({ id: "id-inexistente" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should delete the student when found", async () => {
    const spyDelete = jest.spyOn(repository, "delete");

    const student = repository.create(StudentsDataBuilder({}));
    await repository.insert(student);

    await sut.execute({ id: student.id });

    await expect(repository.findById(student.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });
});
