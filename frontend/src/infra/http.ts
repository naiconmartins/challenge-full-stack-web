import axios from 'axios'
import { env } from '@/config/env'
import { AppError } from '@/errors/app.error'
import type { AppErrorCode } from '@/errors/app.error'

export const AUTH_TOKEN_KEY = 'access_token'
export const SESSION_EXPIRED_KEY = 'session_expired'
const LOGIN_PATH = '/login'

function resolveErrorCode(status: number): AppErrorCode {
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 404) return 'NOT_FOUND'
  if (status === 409) return 'CONFLICT'
  if (status === 422) return 'VALIDATION_ERROR'
  if (status >= 500) return 'SERVER_ERROR'
  return 'UNKNOWN_ERROR'
}

const fallbackMessages: Record<number, string> = {
  401: 'Não autorizado. Por favor, faça login novamente.',
  404: 'Recurso não encontrado.',
  409: 'Conflito: o recurso já existe.',
  422: 'Erro de validação. Verifique os campos e tente novamente.',
  500: 'Erro interno no servidor. Se o problema persistir, entre em contato com o suporte técnico.',
}

const apiMessageTranslations: Record<string, string> = {
  'Invalid credentials': 'Credenciais inválidas. Verifique seu e-mail e senha.',
  'A student with this CPF already exists': 'Já existe um aluno cadastrado com este CPF.',
  'A student with this RA already exists': 'Já existe um aluno cadastrado com este RA.',
  'A student with this email already exists': 'Já existe um aluno cadastrado com este e-mail.',
  'Validation failed': 'Verifique os campos e tente novamente.',
}

const fieldErrorTranslations: Record<string, string> = {
  'RA is required': 'RA é obrigatório',
  'Name is required': 'Nome é obrigatório',
  'Full name is required': 'Nome completo é obrigatório',
  'Name must be at most 100 characters': 'Nome deve ter no máximo 100 caracteres',
  'Invalid email': 'E-mail inválido',
  'CPF is required': 'CPF é obrigatório',
  'Invalid CPF': 'CPF inválido',
}

function translateFieldError(message: string): string {
  return fieldErrorTranslations[message] ?? message
}

function parseFieldErrors(
  errors: Array<{ field: string; message: string }>,
): Record<string, string[]> {
  return errors.reduce<Record<string, string[]>>((acc, { field, message }) => {
    if (!acc[field]) acc[field] = []
    acc[field].push(translateFieldError(message))
    return acc
  }, {})
}

function resolveMessage(status: number, apiMessage?: string): string {
  const translated = apiMessage ? (apiMessageTranslations[apiMessage] ?? apiMessage) : undefined
  const statusKey = status >= 500 ? 500 : status
  return translated ?? fallbackMessages[statusKey] ?? 'Ocorreu um erro inesperado. Se o problema persistir, entre em contato com o suporte técnico.'
}

function redirectToLogin(): void {
  if (typeof window === 'undefined') return
  if (window.location.pathname === LOGIN_PATH) return
  window.location.assign(LOGIN_PATH)
}

export const httpClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response
      if (status === 401) {
        sessionStorage.setItem(SESSION_EXPIRED_KEY, 'true')
        clearAuthToken()
        redirectToLogin()
      }
      const message = resolveMessage(status, data?.message)
      const code = resolveErrorCode(status)
      const errors =
        status === 422 && Array.isArray(data?.errors)
          ? parseFieldErrors(data.errors)
          : undefined
      return Promise.reject(new AppError(message, status, code, errors))
    }

    return Promise.reject(
      new AppError(
        'Não foi possível conectar ao servidor. Verifique sua conexão de rede ou entre em contato com o suporte.',
        0,
        'UNKNOWN_ERROR',
      ),
    )
  },
)

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function consumeSessionExpiredFlag(): boolean {
  const hasExpired = sessionStorage.getItem(SESSION_EXPIRED_KEY) === 'true'
  if (hasExpired) sessionStorage.removeItem(SESSION_EXPIRED_KEY)
  return hasExpired
}
