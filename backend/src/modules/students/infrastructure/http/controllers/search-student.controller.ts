import { dataValidation } from "@/common/infrastructure/validation/zod";
import { SearchStudentUseCase } from "@/modules/students/application/usecases/search-student.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { querySchema } from "../schemas/query.schema";

export async function searchStudentController(
  request: Request,
  response: Response,
): Promise<Response> {
  const { page, per_page, sort, sort_dir, filter } = dataValidation(
    querySchema,
    request.query,
  );

  const searchStudentUseCase: SearchStudentUseCase.UseCase = container.resolve(
    "SearchStudentUseCase",
  );

  const student = await searchStudentUseCase.execute({
    page: page ?? 1,
    per_page: per_page ?? 15,
    sort: sort ?? null,
    sort_dir: sort_dir ?? null,
    filter: filter ?? null,
  });

  return response.status(200).json(student);
}
