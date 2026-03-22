import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { AppError } from '@/domain/errors/app.error'
import type { AppErrorCode } from '@/domain/errors/app.error'

function resolveErrorCode(status: number): AppErrorCode {
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 404) return 'NOT_FOUND'
  if (status === 409) return 'CONFLICT'
  if (status === 422) return 'VALIDATION_ERROR'
  if (status >= 500) return 'SERVER_ERROR'
  return 'UNKNOWN_ERROR'
}

function resolveMessage(status: number, fallback: string): string {
  const messages: Record<number, string> = {
    401: 'Não autorizado. Por favor, faça login novamente.',
    404: 'Recurso não encontrado.',
    409: 'Conflito: o recurso já existe.',
    422: 'Erro de validação. Verifique os campos e tente novamente.',
  }
  return messages[status] ?? fallback
}

export function setupErrorHandler(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response
        const message = resolveMessage(status, data?.message ?? error.message)
        const code = resolveErrorCode(status)
        const errors = status === 422 ? (data?.errors ?? undefined) : undefined
        return Promise.reject(new AppError(message, status, code, errors))
      }

      return Promise.reject(
        new AppError('Erro inesperado. Tente novamente mais tarde.', 0, 'UNKNOWN_ERROR'),
      )
    },
  )
}
