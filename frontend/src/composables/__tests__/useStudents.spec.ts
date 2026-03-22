import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStudents } from '../useStudents'
import { AppError } from '@/errors/app.error'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/services/students.service', () => ({
  studentsService: {
    list: mocks.list,
    getById: mocks.getById,
    create: mocks.create,
    update: mocks.update,
    delete: mocks.delete,
  },
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
      mocks.list.mockReturnValue(
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
      mocks.list.mockResolvedValue(mockListResponse)

      const { list, students } = useStudents()
      await list()

      expect(students.value).toEqual(mockListResponse)
    })

    it('should clear error before each call', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.list.mockRejectedValueOnce(appError)
      mocks.list.mockResolvedValueOnce(mockListResponse)

      const { list, error } = useStudents()

      await list()
      expect(error.value).toEqual(appError)

      await list()
      expect(error.value).toBeNull()
    })

    it('should keep the AppError when service throws an AppError', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.list.mockRejectedValue(appError)

      const { list, error } = useStudents()
      await list()

      expect(error.value).toBe(appError)
    })

    it('should wrap unknown errors in AppError', async () => {
      mocks.list.mockRejectedValue(new Error('network failure'))

      const { list, error } = useStudents()
      await list()

      expect(error.value).toBeInstanceOf(AppError)
      expect(error.value?.message).toBe('Erro inesperado.')
      expect(error.value?.statusCode).toBe(0)
    })

    it('should not rethrow the error', async () => {
      mocks.list.mockRejectedValue(new Error('fail'))

      const { list } = useStudents()

      await expect(list()).resolves.toBeUndefined()
    })
  })

  describe('getById', () => {
    it('should populate student on success', async () => {
      mocks.getById.mockResolvedValue(mockStudent)

      const { getById, student } = useStudents()
      await getById('1')

      expect(student.value).toEqual(mockStudent)
    })

    it('should not rethrow the error', async () => {
      mocks.getById.mockRejectedValue(new Error('fail'))

      const { getById } = useStudents()

      await expect(getById('1')).resolves.toBeUndefined()
    })

    it('should wrap unknown errors in AppError', async () => {
      mocks.getById.mockRejectedValue(new Error('fail'))

      const { getById, error } = useStudents()
      await getById('1')

      expect(error.value).toBeInstanceOf(AppError)
    })
  })

  describe('create', () => {
    const dto = { ra: '123', name: 'João Silva', email: 'joao@exemplo.com.br', cpf: '000.000.000-00' }

    it('should return the created student on success', async () => {
      mocks.create.mockResolvedValue(mockStudent)

      const { create } = useStudents()
      const result = await create(dto)

      expect(result).toEqual(mockStudent)
    })

    it('should rethrow the error after setting error state', async () => {
      const appError = new AppError('Conflict', 409, 'CONFLICT')
      mocks.create.mockRejectedValue(appError)

      const { create, error } = useStudents()

      await expect(create(dto)).rejects.toBeInstanceOf(AppError)
      expect(error.value).toBe(appError)
    })

    it('should set isLoading to false even when it throws', async () => {
      mocks.create.mockRejectedValue(new Error('fail'))

      const { create, isLoading } = useStudents()

      await create(dto).catch(() => {})
      expect(isLoading.value).toBe(false)
    })
  })

  describe('update', () => {
    const dto = { name: 'Maria Santos', email: 'maria@exemplo.com.br' }

    it('should return the updated student on success', async () => {
      const updated = { ...mockStudent, name: 'Maria Santos' }
      mocks.update.mockResolvedValue(updated)

      const { update } = useStudents()
      const result = await update('1', dto)

      expect(result).toEqual(updated)
    })

    it('should rethrow the error after setting error state', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.update.mockRejectedValue(appError)

      const { update, error } = useStudents()

      await expect(update('1', dto)).rejects.toBeInstanceOf(AppError)
      expect(error.value).toBe(appError)
    })

    it('should set isLoading to false even when it throws', async () => {
      mocks.update.mockRejectedValue(new Error('fail'))

      const { update, isLoading } = useStudents()

      await update('1', dto).catch(() => {})
      expect(isLoading.value).toBe(false)
    })
  })

  describe('remove', () => {
    it('should resolve without error on success', async () => {
      mocks.delete.mockResolvedValue(undefined)

      const { remove } = useStudents()

      await expect(remove('1')).resolves.toBeUndefined()
    })

    it('should rethrow the error after setting error state', async () => {
      const appError = new AppError('Not found', 404, 'NOT_FOUND')
      mocks.delete.mockRejectedValue(appError)

      const { remove, error } = useStudents()

      await expect(remove('1')).rejects.toBeInstanceOf(AppError)
      expect(error.value).toBe(appError)
    })

    it('should set isLoading to false even when it throws', async () => {
      mocks.delete.mockRejectedValue(new Error('fail'))

      const { remove, isLoading } = useStudents()

      await remove('1').catch(() => {})
      expect(isLoading.value).toBe(false)
    })
  })
})
