import "reflect-metadata";

import { ConflictError } from "@/common/domain/errors/conflict-error";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";
import { StudentsInMemoryRepository } from "@/modules/students/infrastructure/in-memory/repositories/students-in-memory.repository";
import { UpdateStudentUseCase } from "./update-student.usecase";

describe("UpdateStudentUseCase Unit Tests", () => {
  let sut: UpdateStudentUseCase.UseCase;
  let repository: StudentsRepository;

  beforeEach(() => {
    repository = new StudentsInMemoryRepository();
    sut = new UpdateStudentUseCase.UseCase(repository);
  });

  it("should throw NotFoundError when student does not exist", async () => {
    await expect(
      sut.execute({ id: "fake-id", name: "Any Name", email: "any@email.com" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw ConflictError when email is already used by another student", async () => {
    const student1 = repository.create({
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos@aluno.edu.br",
      cpf: "529.982.247-25",
      created_by: null,
      updated_by: null,
    });
    await repository.insert(student1);

    const student2 = repository.create({
      ra: "20230002",
      name: "Ana Paula Costa",
      email: "ana@aluno.edu.br",
      cpf: "275.484.934-22",
      created_by: null,
      updated_by: null,
    });
    await repository.insert(student2);

    await expect(
      sut.execute({
        id: student2.id,
        name: "Ana Paula Costa",
        email: "carlos@aluno.edu.br",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should allow updating a student keeping the same email", async () => {
    const student = repository.create({
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos@aluno.edu.br",
      cpf: "529.982.247-25",
      created_by: null,
      updated_by: null,
    });
    await repository.insert(student);

    const result = await sut.execute({
      id: student.id,
      name: "Carlos Eduardo Atualizado",
      email: "carlos@aluno.edu.br",
    });

    expect(result.name).toBe("Carlos Eduardo Atualizado");
    expect(result.email).toBe("carlos@aluno.edu.br");
  });

  it("should update name and email of a student", async () => {
    const spyUpdate = jest.spyOn(repository, "update");

    const student = repository.create({
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos@aluno.edu.br",
      cpf: "529.982.247-25",
      created_by: null,
      updated_by: null,
    });
    await repository.insert(student);

    const result = await sut.execute({
      id: student.id,
      name: "Novo Nome Completo",
      email: "novo@aluno.edu.br",
    });

    expect(result.id).toBe(student.id);
    expect(result.ra).toBe(student.ra);
    expect(result.cpf).toBe(student.cpf);
    expect(result.name).toBe("Novo Nome Completo");
    expect(result.email).toBe("novo@aluno.edu.br");
    expect(spyUpdate).toHaveBeenCalledTimes(1);
  });
});
