import { dataValidation } from "@/common/infrastructure/validation/zod";
import { CreateStudentUseCase } from "@/modules/students/application/usecases/create-student.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { createStudentBodySchema } from "../schemas/create-student.schema";

export async function createStudentController(
  request: Request,
  response: Response,
) {
  const input = dataValidation(createStudentBodySchema, request.body);

  const createStudentUseCase: CreateStudentUseCase.UseCase = container.resolve(
    "CreateStudentUseCase",
  );

  const student = await createStudentUseCase.execute({
    ...input,
    created_by: request.user.id,
  });

  return response.status(201).json(student);
}
