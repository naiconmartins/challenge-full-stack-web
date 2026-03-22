import "reflect-metadata";

import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";
import { StudentsInMemoryRepository } from "@/modules/students/infrastructure/in-memory/repositories/students-in-memory.repository";
import { DeleteStudentUseCase } from "./delete-student.usecase";

describe("DeleteStudentUseCase Unit Tests", () => {
  let sut: DeleteStudentUseCase.UseCase;
  let repository: StudentsRepository;

  beforeEach(() => {
    repository = new StudentsInMemoryRepository();
    sut = new DeleteStudentUseCase.UseCase(repository);
  });

  it("should throw NotFoundError when student does not exist", async () => {
    await expect(sut.execute({ id: "fake-id" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should delete the student when found", async () => {
    const spyDelete = jest.spyOn(repository, "delete");

    const student = repository.create({
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos@aluno.edu.br",
      cpf: "529.982.247-25",
      created_by: null,
      updated_by: null,
    });
    await repository.insert(student);

    await sut.execute({ id: student.id });

    await expect(repository.findById(student.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });
});
