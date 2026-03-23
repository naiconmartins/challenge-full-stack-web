import "reflect-metadata";
import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { updateStudentController } from "./update-student.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return res as unknown as Response;
}

describe("updateStudentController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call use case with params, body and updated_by from authenticated user", async () => {
    const student = StudentsDataBuilder({
      id: "8d8e7f5f-cd9e-49f3-822d-0f4f9c3e91ff",
      name: "Maria Silva",
      email: "maria@aluno.edu.br",
      updated_by: "user-id-1",
    });
    const req = {
      body: {
        name: "maria silva",
        email: student.email,
      },
      params: {
        id: student.id,
      },
      user: {
        id: "user-id-1",
        role: "ADMIN",
      },
    } as unknown as Request;
    const res = makeResponse();
    const updateStudentUseCase = {
      execute: jest.fn().mockResolvedValue(student),
    };

    jest
      .spyOn(container, "resolve")
      .mockReturnValue(updateStudentUseCase as never);

    await updateStudentController(req, res);

    expect(updateStudentUseCase.execute).toHaveBeenCalledWith({
      id: student.id,
      name: "Maria Silva",
      email: student.email,
      updated_by: "user-id-1",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(student);
  });
});
