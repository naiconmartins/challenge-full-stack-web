import "reflect-metadata";

import { StudentsInMemoryRepository } from "@/modules/students/infraestructure/in-memory/repositories/students-in-memory.repository";
import { SearchStudentUseCase } from "./search-student.usecase";

describe("SearchStudentUseCase Unit Tests", () => {
  let sut: SearchStudentUseCase.UseCase;
  let repository: StudentsInMemoryRepository;

  beforeEach(() => {
    repository = new StudentsInMemoryRepository();
    sut = new SearchStudentUseCase.UseCase(repository);
  });

  it("should return all students with default pagination when no params are given", async () => {
    const created_at = new Date();
    const items = [
      repository.create({
        ra: "20230001",
        name: "Alice Costa",
        email: "alice@aluno.edu.br",
        cpf: "111.222.333-44",
        created_by: null,
        updated_by: null,
        created_at,
      }),
      repository.create({
        ra: "20230002",
        name: "Bruno Melo",
        email: "bruno@aluno.edu.br",
        cpf: "222.333.444-55",
        created_by: null,
        updated_by: null,
        created_at: new Date(created_at.getTime() + 100),
      }),
      repository.create({
        ra: "20230003",
        name: "Carlos Nunes",
        email: "carlos@aluno.edu.br",
        cpf: "333.444.555-66",
        created_by: null,
        updated_by: null,
        created_at: new Date(created_at.getTime() + 200),
      }),
    ];
    repository.items = items;

    const result = await sut.execute({});

    expect(result).toStrictEqual({
      items: [...items],
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should return output using pagination and filter by name", async () => {
    const items = [
      repository.create({
        ra: "20230001",
        name: "Ana Costa",
        email: "ana@aluno.edu.br",
        cpf: "111",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20230002",
        name: "Ana Lima",
        email: "ana2@aluno.edu.br",
        cpf: "222",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20230003",
        name: "Ana Paula",
        email: "ana3@aluno.edu.br",
        cpf: "333",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20230004",
        name: "Bruno Melo",
        email: "bruno@aluno.edu.br",
        cpf: "444",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20230005",
        name: "Carlos Dumont",
        email: "carlos@aluno.edu.br",
        cpf: "555",
        created_by: null,
        updated_by: null,
      }),
    ];
    repository.items = items;

    let result = await sut.execute({ page: 1, per_page: 2, filter: "ana" });

    expect(result).toStrictEqual({
      items: [items[0], items[1]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    result = await sut.execute({ page: 2, per_page: 2, filter: "ana" });

    expect(result).toStrictEqual({
      items: [items[2]],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });

  it("should return output sorted by name asc and desc", async () => {
    const items = [
      repository.create({
        ra: "20230001",
        name: "c",
        email: "c@aluno.edu.br",
        cpf: "111",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20230002",
        name: "a",
        email: "a@aluno.edu.br",
        cpf: "222",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20230003",
        name: "b",
        email: "b@aluno.edu.br",
        cpf: "333",
        created_by: null,
        updated_by: null,
      }),
    ];
    repository.items = items;

    let result = await sut.execute({ sort: "name", sort_dir: "asc" });

    expect(result).toStrictEqual({
      items: [items[1], items[2], items[0]],
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });

    result = await sut.execute({ sort: "name", sort_dir: "desc" });

    expect(result).toStrictEqual({
      items: [items[0], items[2], items[1]],
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should filter students by RA", async () => {
    const items = [
      repository.create({
        ra: "20230001",
        name: "Alice Costa",
        email: "alice@aluno.edu.br",
        cpf: "111",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20240001",
        name: "Bruno Melo",
        email: "bruno@aluno.edu.br",
        cpf: "222",
        created_by: null,
        updated_by: null,
      }),
      repository.create({
        ra: "20240002",
        name: "Carlos Nunes",
        email: "carlos@aluno.edu.br",
        cpf: "333",
        created_by: null,
        updated_by: null,
      }),
    ];
    repository.items = items;

    const result = await sut.execute({ filter: "2024" });

    expect(result).toStrictEqual({
      items: [items[1], items[2]],
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should return empty items when filter matches no student", async () => {
    const items = [
      repository.create({
        ra: "20230001",
        name: "Alice Costa",
        email: "alice@aluno.edu.br",
        cpf: "111",
        created_by: null,
        updated_by: null,
      }),
    ];
    repository.items = items;

    const result = await sut.execute({ filter: "xyz" });

    expect(result).toStrictEqual({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 15,
      last_page: 0,
    });
  });
});
