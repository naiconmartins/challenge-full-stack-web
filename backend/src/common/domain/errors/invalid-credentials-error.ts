import { AppError } from "./app-error";

export class InvalidCredentialsError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = "InvalidCredentialsError";
  }
}
