import { Request, Response } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { searchStudentController } from "./search-student.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return res as unknown as Response;
}

describe("searchStudentController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call use case with validated query params and return 200", async () => {
    const req = {
      query: {
        page: "2",
        per_page: "10",
        sort: "name",
        sort_dir: "asc",
        filter: "maria",
      },
    } as unknown as Request;
    const res = makeResponse();
    const output = {
      items: [{ id: "1", name: "Maria Silva" }],
      total: 1,
      current_page: 2,
      per_page: 10,
      last_page: 1,
    };
    const searchStudentUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };

    jest
      .spyOn(container, "resolve")
      .mockReturnValue(searchStudentUseCase as never);

    await searchStudentController(req, res);

    expect(searchStudentUseCase.execute).toHaveBeenCalledWith({
      page: 2,
      per_page: 10,
      sort: "name",
      sort_dir: "asc",
      filter: "maria",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(output);
  });

  it("should apply default pagination and null filters when query params are missing", async () => {
    const req = {
      query: {},
    } as unknown as Request;
    const res = makeResponse();
    const output = {
      items: [],
      total: 0,
      current_page: 1,
      per_page: 15,
      last_page: 0,
    };
    const searchStudentUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };

    jest
      .spyOn(container, "resolve")
      .mockReturnValue(searchStudentUseCase as never);

    await searchStudentController(req, res);

    expect(searchStudentUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      per_page: 15,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(output);
  });
});
