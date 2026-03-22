export type AppErrorCode =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: AppErrorCode = 'UNKNOWN_ERROR',
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'AppError'
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError
  }
}
