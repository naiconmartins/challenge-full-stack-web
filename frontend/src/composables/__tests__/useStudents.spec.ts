import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStudents } from '../useStudents'
import { AppError } from '@/domain/errors/app.error'

const mocks = vi.hoisted(() => ({
  list: { execute: vi.fn() },
  get: { execute: vi.fn() },
  create: { execute: vi.fn() },
  update: { execute: vi.fn() },
  remove: { execute: vi.fn() },
}))

vi.mock('@/infrastructure/repositories/student.repository.impl', () => ({
  StudentRepositoryImpl: class {},
}))

vi.mock('@/application/use-cases/students/list-students.use-case', () => ({
  ListStudentsUseCase: vi.fn(function () { return mocks.list }),
}))
vi.mock('@/application/use-cases/students/get-student.use-case', () => ({
  GetStudentUseCase: vi.fn(function () { return mocks.get }),
}))
vi.mock('@/application/use-cases/students/create-student.use-case', () => ({
  CreateStudentUseCase: vi.fn(function () { return mocks.create }),
}))
vi.mock('@/application/use-cases/students/update-student.use-case', () => ({
  UpdateStudentUseCase: vi.fn(function () { return mocks.update }),
}))
vi.mock('@/application/use-cases/students/delete-student.use-case', () => ({
  DeleteStudentUseCase: vi.fn(function () { return mocks.remove }),
}))

const mockStudent = {
  id: '1',
  ra: '123',
  name: 'João Silva',
  email: 'joao@exemplo.com.br',
  cpf: '000.000.000-00',
  created_by: null,
  updated_by: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

const mockListResponse = {
  items: [mockStudent],
  total: 1,
  current_page: 1,
  per_page: 10,
  last_page: 1,
}

describe('useStudents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should set isLoading to true while fetching and false after', async () => {
      let resolvePromise!: (value: typeof mockListResponse) => void
      mocks.list.execute.mockReturnValue(
        new Promise((res) => { resolvePromise = res }),
      )

      const { list, isLoading } = useStudents()

      const promise = list()
      expect(isLoading.value).toBe(true)

      resolvePromise(mockListResponse)
      await promise

      expect(isLoading.value).toBe(false)
    })

    it('should populate students on success', async () => {
      mocks.list.execute.mockResolvedValue(mockListResponse)

      const { list, students } = useStudents()
      await list()

      expect(students.value).toEqual(mockListResponse)
    })

    it('should clear error before each call', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.list.execute.mockRejectedValueOnce(appError)
      mocks.list.execute.mockResolvedValueOnce(mockListResponse)

      const { list, error } = useStudents()

      await list()
      expect(error.value).toEqual(appError)

      await list()
      expect(error.value).toBeNull()
    })

    it('should keep the AppError when use case throws an AppError', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.list.execute.mockRejectedValue(appError)

      const { list, error } = useStudents()
      await list()

      expect(error.value).toBe(appError)
    })

    it('should wrap unknown errors in AppError', async () => {
      mocks.list.execute.mockRejectedValue(new Error('network failure'))

      const { list, error } = useStudents()
      await list()

      expect(error.value).toBeInstanceOf(AppError)
      expect(error.value?.message).toBe('Erro inesperado.')
      expect(error.value?.statusCode).toBe(0)
    })

    it('should not rethrow the error', async () => {
      mocks.list.execute.mockRejectedValue(new Error('fail'))

      const { list } = useStudents()

      await expect(list()).resolves.toBeUndefined()
    })
  })

  describe('getById', () => {
    it('should populate student on success', async () => {
      mocks.get.execute.mockResolvedValue(mockStudent)

      const { getById, student } = useStudents()
      await getById('1')

      expect(student.value).toEqual(mockStudent)
    })

    it('should not rethrow the error', async () => {
      mocks.get.execute.mockRejectedValue(new Error('fail'))

      const { getById } = useStudents()

      await expect(getById('1')).resolves.toBeUndefined()
    })

    it('should wrap unknown errors in AppError', async () => {
      mocks.get.execute.mockRejectedValue(new Error('fail'))

      const { getById, error } = useStudents()
      await getById('1')

      expect(error.value).toBeInstanceOf(AppError)
    })
  })

  describe('create', () => {
    const dto = { ra: '123', name: 'João Silva', email: 'joao@exemplo.com.br', cpf: '000.000.000-00' }

    it('should return the created student on success', async () => {
      mocks.create.execute.mockResolvedValue(mockStudent)

      const { create } = useStudents()
      const result = await create(dto)

      expect(result).toEqual(mockStudent)
    })

    it('should rethrow the error after setting error state', async () => {
      const appError = new AppError('Conflict', 409, 'CONFLICT')
      mocks.create.execute.mockRejectedValue(appError)

      const { create, error } = useStudents()

      await expect(create(dto)).rejects.toBeInstanceOf(AppError)
      expect(error.value).toBe(appError)
    })

    it('should set isLoading to false even when it throws', async () => {
      mocks.create.execute.mockRejectedValue(new Error('fail'))

      const { create, isLoading } = useStudents()

      await create(dto).catch(() => {})
      expect(isLoading.value).toBe(false)
    })
  })

  describe('update', () => {
    const dto = { name: 'Maria Santos', email: 'maria@exemplo.com.br' }

    it('should return the updated student on success', async () => {
      const updated = { ...mockStudent, name: 'Maria Santos' }
      mocks.update.execute.mockResolvedValue(updated)

      const { update } = useStudents()
      const result = await update('1', dto)

      expect(result).toEqual(updated)
    })

    it('should rethrow the error after setting error state', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.update.execute.mockRejectedValue(appError)

      const { update, error } = useStudents()

      await expect(update('1', dto)).rejects.toBeInstanceOf(AppError)
      expect(error.value).toBe(appError)
    })

    it('should set isLoading to false even when it throws', async () => {
      mocks.update.execute.mockRejectedValue(new Error('fail'))

      const { update, isLoading } = useStudents()

      await update('1', dto).catch(() => {})
      expect(isLoading.value).toBe(false)
    })
  })

  describe('remove', () => {
    it('should resolve without error on success', async () => {
      mocks.remove.execute.mockResolvedValue(undefined)

      const { remove } = useStudents()

      await expect(remove('1')).resolves.toBeUndefined()
    })

    it('should rethrow the error after setting error state', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.remove.execute.mockRejectedValue(appError)

      const { remove, error } = useStudents()

      await expect(remove('1')).rejects.toBeInstanceOf(AppError)
      expect(error.value).toBe(appError)
    })

    it('should set isLoading to false even when it throws', async () => {
      mocks.remove.execute.mockRejectedValue(new Error('fail'))

      const { remove, isLoading } = useStudents()

      await remove('1').catch(() => {})
      expect(isLoading.value).toBe(false)
    })
  })
})
