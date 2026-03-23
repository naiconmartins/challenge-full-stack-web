import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStudentList } from '../useStudentList'
import { AppError } from '@/errors/app.error'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
}))

vi.mock('@/services/students.service', () => ({
  studentsService: { list: mocks.list },
}))

const mockStudent = {
  id: '1',
  ra: '123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  cpf: '00000000000',
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

describe('useStudentList', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('fetchStudents', () => {
    it('sets isLoading to true while fetching and false after', async () => {
      let resolve!: (v: typeof mockListResponse) => void
      mocks.list.mockReturnValue(new Promise(res => { resolve = res }))

      const { fetchStudents, isLoading } = useStudentList()
      const promise = fetchStudents()

      expect(isLoading.value).toBe(true)

      resolve(mockListResponse)
      await promise

      expect(isLoading.value).toBe(false)
    })

    it('populates students and pagination state on success', async () => {
      mocks.list.mockResolvedValue(mockListResponse)

      const { fetchStudents, students, total, currentPage, lastPage } = useStudentList()
      await fetchStudents()

      expect(students.value).toEqual([mockStudent])
      expect(total.value).toBe(1)
      expect(currentPage.value).toBe(1)
      expect(lastPage.value).toBe(1)
    })

    it('clears error before each call', async () => {
      mocks.list.mockRejectedValueOnce(new AppError('Erro', 500, 'SERVER_ERROR'))
      mocks.list.mockResolvedValueOnce(mockListResponse)

      const { fetchStudents, error } = useStudentList()

      await fetchStudents()
      expect(error.value).toBeTruthy()

      await fetchStudents()
      expect(error.value).toBeNull()
    })

    it('sets error message from AppError', async () => {
      mocks.list.mockRejectedValue(new AppError('Falha na listagem', 500, 'SERVER_ERROR'))

      const { fetchStudents, error } = useStudentList()
      await fetchStudents()

      expect(error.value).toBe('Falha na listagem')
    })

    it('sets generic error message for unknown errors', async () => {
      mocks.list.mockRejectedValue(new Error('falha de rede'))

      const { fetchStudents, error } = useStudentList()
      await fetchStudents()

      expect(error.value).toBe('Erro inesperado ao carregar alunos.')
    })

    it('sets isLoading to false even on error', async () => {
      mocks.list.mockRejectedValue(new Error('falha'))

      const { fetchStudents, isLoading } = useStudentList()
      await fetchStudents()

      expect(isLoading.value).toBe(false)
    })

    it('passes page and per_page to the service', async () => {
      mocks.list.mockResolvedValue(mockListResponse)

      const { fetchStudents } = useStudentList()
      await fetchStudents()

      expect(mocks.list).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, per_page: 10 }),
      )
    })
  })

  describe('search', () => {
    it('resets currentPage to 1 before fetching', async () => {
      mocks.list.mockResolvedValue({ ...mockListResponse, current_page: 1 })

      const { search, currentPage } = useStudentList()
      currentPage.value = 5

      await search()

      expect(mocks.list).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 }),
      )
    })

    it('passes the current searchTerm as filter', async () => {
      mocks.list.mockResolvedValue(mockListResponse)

      const { search, searchTerm } = useStudentList()
      searchTerm.value = 'João'

      await search()

      expect(mocks.list).toHaveBeenCalledWith(
        expect.objectContaining({ filter: 'João' }),
      )
    })

    it('omits filter when searchTerm is empty', async () => {
      mocks.list.mockResolvedValue(mockListResponse)

      const { search, searchTerm } = useStudentList()
      searchTerm.value = ''

      await search()

      expect(mocks.list).toHaveBeenCalledWith(
        expect.not.objectContaining({ filter: expect.anything() }),
      )
    })
  })

  describe('changePage', () => {
    it('updates currentPage and fetches with the new page', async () => {
      mocks.list.mockResolvedValue({ ...mockListResponse, current_page: 3 })

      const { changePage } = useStudentList()
      await changePage(3)

      expect(mocks.list).toHaveBeenCalledWith(
        expect.objectContaining({ page: 3 }),
      )
    })

    it('preserves the current searchTerm when changing page', async () => {
      mocks.list.mockResolvedValue(mockListResponse)

      const { changePage, searchTerm } = useStudentList()
      searchTerm.value = 'Maria'

      await changePage(2)

      expect(mocks.list).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, filter: 'Maria' }),
      )
    })
  })
})
