import "reflect-metadata";

import { ConflictError } from "@/common/domain/errors/conflict-error";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";
import { StudentsInMemoryRepository } from "@/modules/students/infrastructure/in-memory/repositories/students-in-memory.repository";
import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { CreateStudentUseCase } from "./create-student.usecase";

describe("CreateStudentUseCase Unit Tests", () => {
  let sut: CreateStudentUseCase.UseCase;
  let repository: StudentsRepository;

  beforeEach(() => {
    repository = new StudentsInMemoryRepository();
    sut = new CreateStudentUseCase.UseCase(repository);
  });

  it("should create a student", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    const props = {
      ...StudentsDataBuilder({}),
      created_by: "user-id-1",
    };
    const result = await sut.execute(props);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeDefined();
    expect(result.ra).toBe(props.ra);
    expect(result.name).toBe(props.name);
    expect(result.email).toBe(props.email);
    expect(result.cpf).toBe(props.cpf);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it("should not be possible to register a student with the CPF of another student", async () => {
    const props = { ...StudentsDataBuilder({}), created_by: "user-id-1" };
    await sut.execute(props);
    await expect(
      sut.execute({ ...props, ra: "99990001", email: "outro@aluno.edu.br" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should not be possible to register a student with the RA of another student", async () => {
    const props = { ...StudentsDataBuilder({}), created_by: "user-id-1" };
    await sut.execute(props);
    await expect(
      sut.execute({
        ...StudentsDataBuilder({}),
        ra: props.ra,
        created_by: "user-id-1",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should not be possible to register a student with the email of another student", async () => {
    const props = { ...StudentsDataBuilder({}), created_by: "user-id-1" };
    await sut.execute(props);
    await expect(
      sut.execute({
        ...StudentsDataBuilder({}),
        email: props.email,
        created_by: "user-id-1",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
