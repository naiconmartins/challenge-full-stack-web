import { ValidationError } from "@/common/domain/errors/validation-error";

/**
 * @param schema object with the Zod validation schema
 * @param data object with the data to be validated
 * @returns the validated data
 */
export function dataValidation(schema: any, data: any) {
  const validatedData = schema.safeParse(data);

  if (validatedData.success === false) {
    throw new ValidationError(
      validatedData.error.issues.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    );
  }
  return validatedData.data;
}
