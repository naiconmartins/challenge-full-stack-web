import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { Request, Response } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { getStudentController } from "./get-student.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return res as unknown as Response;
}

describe("getStudentController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call use case with validated params and return 200", async () => {
    const student = StudentsDataBuilder({
      id: "8d8e7f5f-cd9e-49f3-822d-0f4f9c3e91ff",
    });
    const req = {
      params: {
        id: student.id,
      },
    } as unknown as Request;
    const res = makeResponse();
    const getStudentUseCase = {
      execute: jest.fn().mockResolvedValue(student),
    };

    jest.spyOn(container, "resolve").mockReturnValue(getStudentUseCase as never);

    await getStudentController(req, res);

    expect(getStudentUseCase.execute).toHaveBeenCalledWith({
      id: student.id,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(student);
  });
});
