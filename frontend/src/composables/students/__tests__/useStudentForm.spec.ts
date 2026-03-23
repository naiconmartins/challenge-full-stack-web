import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useStudentForm } from '../useStudentForm'
import { AppError } from '@/errors/app.error'

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()
  return { ...actual, onMounted: (fn: () => unknown) => fn() }
})

const mocks = vi.hoisted(() => ({
  routeParams: {} as Record<string, string>,
  push: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  notify: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: mocks.routeParams }),
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('@/services/students.service', () => ({
  studentsService: {
    getById: mocks.getById,
    create: mocks.create,
    update: mocks.update,
  },
}))

vi.mock('@/composables/shared/useNotification', () => ({
  useNotification: () => ({ notify: mocks.notify }),
}))

const mockStudent = {
  id: '1',
  ra: '123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  cpf: '12345678901',
  created_by: null,
  updated_by: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

function mockFormRef(valid = true) {
  return { validate: vi.fn().mockResolvedValue({ valid }) }
}

describe('useStudentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.routeParams = {}
  })

  describe('loadStudent (via onMounted)', () => {
    it('does not call getById in create mode', async () => {
      useStudentForm()
      await flushPromises()

      expect(mocks.getById).not.toHaveBeenCalled()
    })

    it('sets isFetching to true while loading and false after', async () => {
      mocks.routeParams = { id: '1' }
      let resolve!: (v: typeof mockStudent) => void
      mocks.getById.mockReturnValue(new Promise(res => { resolve = res }))

      const { isFetching } = useStudentForm()
      expect(isFetching.value).toBe(true)

      resolve(mockStudent)
      await flushPromises()

      expect(isFetching.value).toBe(false)
    })

    it('populates the form with fetched student data in edit mode', async () => {
      mocks.routeParams = { id: '1' }
      mocks.getById.mockResolvedValue(mockStudent)

      const { form } = useStudentForm()
      await flushPromises()

      expect(mocks.getById).toHaveBeenCalledWith('1')
      expect(form.ra).toBe(mockStudent.ra)
      expect(form.name).toBe(mockStudent.name)
      expect(form.email).toBe(mockStudent.email)
      expect(form.cpf).toBe(mockStudent.cpf)
    })

    it('sets errorMessage when getById fails', async () => {
      mocks.routeParams = { id: '1' }
      mocks.getById.mockRejectedValue(new AppError('Não encontrado', 404, 'NOT_FOUND'))

      const { errorMessage } = useStudentForm()
      await flushPromises()

      expect(errorMessage.value).toBe('Não encontrado')
    })

    it('sets generic errorMessage for unknown errors during load', async () => {
      mocks.routeParams = { id: '1' }
      mocks.getById.mockRejectedValue(new Error('falha de rede'))

      const { errorMessage } = useStudentForm()
      await flushPromises()

      expect(errorMessage.value).toBe('Não foi possível carregar os dados do aluno. Se o problema persistir, entre em contato com o suporte.')
    })
  })

  describe('isEditMode', () => {
    it('is false when there is no route id param', () => {
      mocks.routeParams = {}
      const { isEditMode } = useStudentForm()
      expect(isEditMode.value).toBe(false)
    })

    it('is true when there is a route id param', () => {
      mocks.routeParams = { id: '1' }
      mocks.getById.mockResolvedValue(mockStudent)
      const { isEditMode } = useStudentForm()
      expect(isEditMode.value).toBe(true)
    })
  })

  describe('handleSubmit', () => {
    it('does not call any service when form is invalid', async () => {
      const { handleSubmit, formRef } = useStudentForm()
      formRef.value = mockFormRef(false)
      await flushPromises()

      await handleSubmit()

      expect(mocks.create).not.toHaveBeenCalled()
      expect(mocks.update).not.toHaveBeenCalled()
    })

    it('calls create with correct payload in create mode', async () => {
      mocks.create.mockResolvedValue({})

      const { handleSubmit, form, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      form.ra = '456'
      form.name = 'Maria Santos'
      form.email = 'maria@teste.com'
      form.cpf = '987.654.321-00'

      await handleSubmit()

      expect(mocks.create).toHaveBeenCalledWith({
        ra: '456',
        name: 'Maria Santos',
        email: 'maria@teste.com',
        cpf: '98765432100',
      })
    })

    it('strips CPF formatting before creating', async () => {
      mocks.create.mockResolvedValue({})

      const { handleSubmit, form, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      form.cpf = '123.456.789-01'
      await handleSubmit()

      expect(mocks.create).toHaveBeenCalledWith(
        expect.objectContaining({ cpf: '12345678901' }),
      )
    })

    it('notifies and navigates to home after create', async () => {
      mocks.create.mockResolvedValue({})

      const { handleSubmit, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()

      expect(mocks.notify).toHaveBeenCalledWith('Aluno cadastrado com sucesso!')
      expect(mocks.push).toHaveBeenCalledWith({ name: 'home' })
    })

    it('calls update with only name and email in edit mode', async () => {
      mocks.routeParams = { id: '1' }
      mocks.getById.mockResolvedValue(mockStudent)
      mocks.update.mockResolvedValue({})

      const { handleSubmit, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()

      expect(mocks.update).toHaveBeenCalledWith('1', {
        name: mockStudent.name,
        email: mockStudent.email,
      })
    })

    it('notifies and navigates to home after update', async () => {
      mocks.routeParams = { id: '1' }
      mocks.getById.mockResolvedValue(mockStudent)
      mocks.update.mockResolvedValue({})

      const { handleSubmit, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()

      expect(mocks.notify).toHaveBeenCalledWith('Aluno atualizado com sucesso!')
      expect(mocks.push).toHaveBeenCalledWith({ name: 'home' })
    })

    it('populates fieldErrors and errorMessage on AppError with field errors', async () => {
      mocks.create.mockRejectedValue(
        new AppError('Verifique os campos', 422, 'VALIDATION_ERROR', {
          email: ['E-mail já cadastrado'],
          ra: ['RA obrigatório'],
        }),
      )

      const { handleSubmit, fieldErrors, errorMessage, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()

      expect(fieldErrors.email).toEqual(['E-mail já cadastrado'])
      expect(fieldErrors.ra).toEqual(['RA obrigatório'])
      expect(errorMessage.value).toBeTruthy()
    })

    it('sets errorMessage on AppError without field errors', async () => {
      mocks.create.mockRejectedValue(new AppError('Conflito de CPF', 409, 'CONFLICT'))

      const { handleSubmit, errorMessage, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()

      expect(errorMessage.value).toBe('Conflito de CPF')
    })

    it('sets generic errorMessage for unknown errors', async () => {
      mocks.create.mockRejectedValue(new Error('erro de rede'))

      const { handleSubmit, errorMessage, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()

      expect(errorMessage.value).toBe('Não foi possível salvar os dados. Se o problema persistir, entre em contato com o suporte.')
    })

    it('sets isLoading to false even on error', async () => {
      mocks.create.mockRejectedValue(new Error('falha'))

      const { handleSubmit, isLoading, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()

      expect(isLoading.value).toBe(false)
    })

    it('clears previous fieldErrors before each submit', async () => {
      const error = new AppError('Erro', 422, 'VALIDATION_ERROR', { email: ['Inválido'] })
      mocks.create.mockRejectedValueOnce(error)
      mocks.create.mockResolvedValueOnce({})

      const { handleSubmit, fieldErrors, formRef } = useStudentForm()
      formRef.value = mockFormRef()
      await flushPromises()

      await handleSubmit()
      expect(fieldErrors.email).toEqual(['Inválido'])

      await handleSubmit()
      expect(fieldErrors.email).toEqual([])
    })
  })

  describe('handleCancel', () => {
    it('navigates to home', () => {
      const { handleCancel } = useStudentForm()
      handleCancel()
      expect(mocks.push).toHaveBeenCalledWith({ name: 'home' })
    })
  })
})
