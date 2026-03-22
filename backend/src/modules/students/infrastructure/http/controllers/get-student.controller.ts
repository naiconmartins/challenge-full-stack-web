import { dataValidation } from "@/common/infrastructure/validation/zod";
import { GetStudentUseCase } from "@/modules/students/application/usecases/get-student.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { getStudentParamSchema } from "../schemas/get-student.schema";

export async function getStudentController(
  request: Request,
  response: Response,
) {
  const id = dataValidation(getStudentParamSchema, request.params);

  const getStudentUseCase: GetStudentUseCase.UseCase =
    container.resolve("GetStudentUseCase");

  const student = await getStudentUseCase.execute(id);

  return response.status(200).json(student);
}
