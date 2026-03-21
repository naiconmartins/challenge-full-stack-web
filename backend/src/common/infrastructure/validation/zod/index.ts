import { AppError } from "@/common/domain/errors/app-error";

/**
 * @param schema object with the Zod validation schema
 * @param data object with the data to be validated
 * @returns the validated data
 */
export function dataValidation(schema: any, data: any) {
  const validatedData = schema.safeParse(data);

  if (validatedData.success === false) {
    console.error("Invalid data", validatedData.error.format());
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} -> ${err.message}`;
      })}`,
    );
  }
  return validatedData.data;
}
