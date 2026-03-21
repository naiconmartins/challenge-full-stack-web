export type FieldError = {
  field: string;
  message: string;
};

export class ValidationError extends Error {
  public readonly statusCode = 422;
  public readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super("Validation failed");
    this.errors = errors;
  }
}
