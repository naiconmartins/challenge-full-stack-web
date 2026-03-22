import { dataValidation } from "@/common/infrastructure/validation/zod";
import { UpdateStudentUseCase } from "@/modules/students/application/usecases/update-student.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import {
  updateStudentBodySchema,
  updateStudentParamSchema,
} from "../schemas/update-student.schema";

export async function updateStudentController(
  request: Request,
  response: Response,
) {
  const input = dataValidation(updateStudentBodySchema, request.body);

  const id = dataValidation(updateStudentParamSchema, request.params);

  const updateStudentUseCase: UpdateStudentUseCase.UseCase = container.resolve(
    "UpdateStudentUseCase",
  );

  const student = await updateStudentUseCase.execute({
    ...id,
    ...input,
    updated_by: request.user.id,
  });

  return response.status(200).json(student);
}
