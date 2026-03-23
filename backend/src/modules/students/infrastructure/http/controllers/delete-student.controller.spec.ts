import { Request, Response } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { deleteStudentController } from "./delete-student.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  return res as unknown as Response;
}

describe("deleteStudentController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call use case with validated params and return 204", async () => {
    const req = {
      params: {
        id: "8d8e7f5f-cd9e-49f3-822d-0f4f9c3e91ff",
      },
    } as unknown as Request;
    const res = makeResponse();
    const deleteStudentUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };

    jest
      .spyOn(container, "resolve")
      .mockReturnValue(deleteStudentUseCase as never);

    await deleteStudentController(req, res);

    expect(deleteStudentUseCase.execute).toHaveBeenCalledWith({
      id: "8d8e7f5f-cd9e-49f3-822d-0f4f9c3e91ff",
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
