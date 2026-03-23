import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppError } from '@/errors/app.error'
import { useLoginForm } from './useLoginForm'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  login: vi.fn(),
  isLoading: false,
  consumeSessionExpiredFlag: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('pinia', () => ({
  storeToRefs: () => ({ isLoading: { value: mocks.isLoading } }),
}))

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({ login: mocks.login }),
}))

vi.mock('@/infra/http', () => ({
  consumeSessionExpiredFlag: mocks.consumeSessionExpiredFlag,
}))

function mockFormRef(valid = true) {
  return { validate: vi.fn().mockResolvedValue({ valid }) }
}

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isLoading = false
    mocks.consumeSessionExpiredFlag.mockReturnValue(false)
  })

  it('shows a session expired message when the flag is present', () => {
    mocks.consumeSessionExpiredFlag.mockReturnValue(true)

    const { errorMessage } = useLoginForm()

    expect(errorMessage.value).toBe('Sua sessão expirou. Faça login novamente.')
    expect(mocks.consumeSessionExpiredFlag).toHaveBeenCalledOnce()
  })

  it('does not show a session expired message when the flag is absent', () => {
    const { errorMessage } = useLoginForm()

    expect(errorMessage.value).toBe('')
  })

  it('logs in and redirects when the form is valid', async () => {
    mocks.login.mockResolvedValue(undefined)

    const { form, formRef, handleLogin } = useLoginForm()
    formRef.value = mockFormRef()
    form.email = 'user@example.com'
    form.password = '123456'

    await handleLogin()

    expect(mocks.login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: '123456',
    })
    expect(mocks.push).toHaveBeenCalledWith('/')
  })

  it('surfaces app errors from login failures', async () => {
    mocks.login.mockRejectedValue(new AppError('Credenciais inválidas', 401, 'UNAUTHORIZED'))

    const { formRef, errorMessage, handleLogin } = useLoginForm()
    formRef.value = mockFormRef()

    await handleLogin()

    expect(errorMessage.value).toBe('Credenciais inválidas')
  })
})
