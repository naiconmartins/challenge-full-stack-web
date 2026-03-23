import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { Request, Response } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { createStudentController } from "./create-student.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return res as unknown as Response;
}

describe("createStudentController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call use case with created_by from authenticated user and return 201", async () => {
    const student = StudentsDataBuilder({
      name: "Maria Silva",
      email: "maria@aluno.edu.br",
      cpf: "529.982.247-25",
      created_by: "user-id-1",
    });
    const req = {
      body: {
        ra: student.ra,
        name: "maria silva",
        email: student.email,
        cpf: student.cpf,
      },
      user: {
        id: "user-id-1",
        role: "ADMINISTRATIVE",
      },
    } as Request;
    const res = makeResponse();
    const createStudentUseCase = {
      execute: jest.fn().mockResolvedValue(student),
    };

    jest
      .spyOn(container, "resolve")
      .mockReturnValue(createStudentUseCase as never);

    await createStudentController(req, res);

    expect(createStudentUseCase.execute).toHaveBeenCalledWith({
      ra: student.ra,
      name: "Maria Silva",
      email: student.email,
      cpf: student.cpf,
      created_by: "user-id-1",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(student);
  });
});
