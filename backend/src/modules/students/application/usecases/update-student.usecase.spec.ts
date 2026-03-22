import "reflect-metadata";

import { ConflictError } from "@/common/domain/errors/conflict-error";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";
import { StudentsInMemoryRepository } from "@/modules/students/infrastructure/in-memory/repositories/students-in-memory.repository";
import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { UpdateStudentUseCase } from "./update-student.usecase";

describe("UpdateStudentUseCase Unit Tests", () => {
  let sut: UpdateStudentUseCase.UseCase;
  let repository: StudentsRepository;

  beforeEach(() => {
    repository = new StudentsInMemoryRepository();
    sut = new UpdateStudentUseCase.UseCase(repository);
  });

  it("should throw NotFoundError when student does not exist", async () => {
    const props = StudentsDataBuilder({});
    await expect(
      sut.execute({
        id: "id-inexistente",
        name: props.name,
        email: props.email,
        updated_by: "user-id-1",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw ConflictError when email is already used by another student", async () => {
    const student1 = repository.create(StudentsDataBuilder({}));
    await repository.insert(student1);

    const student2 = repository.create(StudentsDataBuilder({}));
    await repository.insert(student2);

    await expect(
      sut.execute({
        id: student2.id,
        name: student2.name,
        email: student1.email,
        updated_by: "user-id-1",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should allow updating a student keeping the same email", async () => {
    const student = repository.create(StudentsDataBuilder({}));
    await repository.insert(student);

    const result = await sut.execute({
      id: student.id,
      name: "Carlos Eduardo Atualizado",
      email: student.email,
      updated_by: "user-id-1",
    });

    expect(result.name).toBe("Carlos Eduardo Atualizado");
    expect(result.email).toBe(student.email);
  });

  it("should update name and email of a student", async () => {
    const spyUpdate = jest.spyOn(repository, "update");

    const student = repository.create(StudentsDataBuilder({}));
    await repository.insert(student);

    const newData = StudentsDataBuilder({});

    const result = await sut.execute({
      id: student.id,
      name: newData.name,
      email: newData.email,
      updated_by: "user-id-1",
    });

    expect(result.id).toBe(student.id);
    expect(result.ra).toBe(student.ra);
    expect(result.cpf).toBe(student.cpf);
    expect(result.name).toBe(newData.name);
    expect(result.email).toBe(newData.email);
    expect(spyUpdate).toHaveBeenCalledTimes(1);
  });
});
