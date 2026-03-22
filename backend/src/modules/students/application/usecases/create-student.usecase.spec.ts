import "reflect-metadata";

import { ConflictError } from "@/common/domain/errors/conflit-error";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";
import { StudentsInMemoryRepository } from "@/modules/students/infrastructure/in-memory/repositories/students-in-memory.repository";
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
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos.silva@aluno.edu.br",
      cpf: "529.982.247-25",
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
    const props = {
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos.silva@aluno.edu.br",
      cpf: "529.982.247-25",
    };
    await sut.execute(props);
    await expect(
      sut.execute({ ...props, ra: "20230002", email: "outro@aluno.edu.br" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should not be possible to register a student with the RA of another student", async () => {
    const props = {
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos.silva@aluno.edu.br",
      cpf: "529.982.247-25",
    };
    await sut.execute(props);
    await expect(
      sut.execute({
        ...props,
        cpf: "275.484.934-22",
        email: "outro@aluno.edu.br",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should not be possible to register a student with the email of another student", async () => {
    const props = {
      ra: "20230001",
      name: "Carlos Eduardo Silva",
      email: "carlos.silva@aluno.edu.br",
      cpf: "529.982.247-25",
    };
    await sut.execute(props);
    await expect(
      sut.execute({
        ...props,
        ra: "20230002",
        cpf: "275.484.934-22",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
