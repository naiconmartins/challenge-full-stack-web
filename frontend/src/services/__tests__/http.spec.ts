import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppError } from '@/errors/app.error'

vi.mock('@/config/env', () => ({
  env: { VITE_API_URL: 'http://localhost:3000' },
}))

const { httpClient, setAuthToken, clearAuthToken } = await import('@/services/http')

const responseHandlers = (httpClient.interceptors.response as any).handlers
const handleResponseError: (error: unknown) => Promise<never> = responseHandlers[0].rejected

const requestHandlers = (httpClient.interceptors.request as any).handlers
const handleRequest: (config: any) => any = requestHandlers[0].fulfilled

function makeAxiosError(status: number, data: Record<string, unknown> = {}) {
  return { isAxiosError: true, response: { status, data } }
}

describe('setAuthToken / clearAuthToken', () => {
  beforeEach(() => localStorage.clear())

  it('stores the token in localStorage', () => {
    setAuthToken('my-token')
    expect(localStorage.getItem('access_token')).toBe('my-token')
  })

  it('removes the token from localStorage', () => {
    localStorage.setItem('access_token', 'my-token')
    clearAuthToken()
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})

describe('response interceptor', () => {
  it('maps 401 to UNAUTHORIZED AppError', async () => {
    const err = await handleResponseError(makeAxiosError(401)).catch(e => e)
    expect(err).toBeInstanceOf(AppError)
    expect(err.code).toBe('UNAUTHORIZED')
    expect(err.statusCode).toBe(401)
  })

  it('maps 404 to NOT_FOUND AppError', async () => {
    const err = await handleResponseError(makeAxiosError(404)).catch(e => e)
    expect(err).toBeInstanceOf(AppError)
    expect(err.code).toBe('NOT_FOUND')
  })

  it('maps 409 to CONFLICT AppError', async () => {
    const err = await handleResponseError(makeAxiosError(409)).catch(e => e)
    expect(err).toBeInstanceOf(AppError)
    expect(err.code).toBe('CONFLICT')
  })

  it('maps 422 to VALIDATION_ERROR AppError', async () => {
    const err = await handleResponseError(makeAxiosError(422)).catch(e => e)
    expect(err).toBeInstanceOf(AppError)
    expect(err.code).toBe('VALIDATION_ERROR')
  })

  it('maps 500 to SERVER_ERROR AppError', async () => {
    const err = await handleResponseError(makeAxiosError(500)).catch(e => e)
    expect(err).toBeInstanceOf(AppError)
    expect(err.code).toBe('SERVER_ERROR')
  })

  it('translates known API messages to Portuguese', async () => {
    const err = await handleResponseError(
      makeAxiosError(409, { message: 'A student with this CPF already exists' }),
    ).catch(e => e)
    expect(err.message).toBe('Já existe um aluno cadastrado com este CPF.')
  })

  it('falls back to the untranslated message when not in dictionary', async () => {
    const err = await handleResponseError(
      makeAxiosError(409, { message: 'Algum erro desconhecido' }),
    ).catch(e => e)
    expect(err.message).toBe('Algum erro desconhecido')
  })

  it('parses field errors array on 422 and translates messages', async () => {
    const err = await handleResponseError(
      makeAxiosError(422, {
        errors: [
          { field: 'cpf', message: 'Invalid CPF' },
          { field: 'email', message: 'Invalid email' },
        ],
      }),
    ).catch(e => e)
    expect(err.errors).toEqual({
      cpf: ['CPF inválido'],
      email: ['E-mail inválido'],
    })
  })

  it('groups multiple errors for the same field', async () => {
    const err = await handleResponseError(
      makeAxiosError(422, {
        errors: [
          { field: 'cpf', message: 'CPF is required' },
          { field: 'cpf', message: 'Invalid CPF' },
        ],
      }),
    ).catch(e => e)
    expect(err.errors?.cpf).toHaveLength(2)
  })

  it('wraps non-axios errors in a generic UNKNOWN_ERROR AppError', async () => {
    const err = await handleResponseError(new Error('falha de rede')).catch(e => e)
    expect(err).toBeInstanceOf(AppError)
    expect(err.code).toBe('UNKNOWN_ERROR')
  })

  it('always rejects (never resolves)', async () => {
    await expect(handleResponseError(makeAxiosError(401))).rejects.toBeInstanceOf(AppError)
  })
})

describe('request interceptor', () => {
  beforeEach(() => localStorage.clear())

  it('adds Authorization header when token exists', () => {
    localStorage.setItem('access_token', 'abc123')
    const config = { headers: {} as Record<string, string> }
    const result = handleRequest(config)
    expect(result.headers.Authorization).toBe('Bearer abc123')
  })

  it('does not add Authorization header when no token', () => {
    const config = { headers: {} as Record<string, string> }
    const result = handleRequest(config)
    expect(result.headers.Authorization).toBeUndefined()
  })

  it('returns the config object', () => {
    const config = { headers: {}, baseURL: 'http://localhost:3000' }
    const result = handleRequest(config)
    expect(result).toBe(config)
  })
})
